#!/usr/bin/env python3
"""
Converts CSV experiment results into JSON files for the web app.

Reads from:
  - results/experimental_results.csv
  - results/analysis/paired_comparison.csv
  - results/analysis/statistical_tests.csv
  - results/analysis/segmented_analysis.csv

Outputs to web/data/:
  - experimental_results.json
  - paired_comparison.json
  - statistical_tests.json
  - segmented_analysis.json
  - experiment_summary.json
"""

import json
import math
import os
import sys

import pandas as pd

# ---------- paths ----------
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
RESULTS_DIR = os.path.join(BASE_DIR, "results")
ANALYSIS_DIR = os.path.join(RESULTS_DIR, "analysis")
OUTPUT_DIR = os.path.join(BASE_DIR, "web", "data")

EXPERIMENTAL_RESULTS_CSV = os.path.join(RESULTS_DIR, "experimental_results.csv")
PAIRED_COMPARISON_CSV = os.path.join(ANALYSIS_DIR, "paired_comparison.csv")
STATISTICAL_TESTS_CSV = os.path.join(ANALYSIS_DIR, "statistical_tests.csv")
SEGMENTED_ANALYSIS_CSV = os.path.join(ANALYSIS_DIR, "segmented_analysis.csv")

ALPHAS = [0.5, 0.6, 0.7, 0.8, 0.9, 1.0]


# ---------- helpers ----------
def nan_to_none(obj):
    """Recursively replace NaN / Inf with None for JSON serialisation."""
    if isinstance(obj, float):
        if math.isnan(obj) or math.isinf(obj):
            return None
        # Preserve significant digits for very small numbers (e.g. p-values)
        if obj != 0.0 and abs(obj) < 1e-4:
            return float(f"{obj:.6e}")
        return round(obj, 6)
    if isinstance(obj, dict):
        return {k: nan_to_none(v) for k, v in obj.items()}
    if isinstance(obj, list):
        return [nan_to_none(v) for v in obj]
    return obj


def write_json(path, data, compact=True):
    """Write data to a JSON file. compact=True omits indentation."""
    data = nan_to_none(data)
    with open(path, "w", encoding="utf-8") as f:
        if compact:
            json.dump(data, f, ensure_ascii=False, separators=(",", ":"))
        else:
            json.dump(data, f, ensure_ascii=False, indent=2)
    size_kb = os.path.getsize(path) / 1024
    print(f"  {os.path.basename(path):40s} {size_kb:8.1f} KB")


# ---------- 1. experimental_results.json ----------
def generate_experimental_results():
    df = pd.read_csv(EXPERIMENTAL_RESULTS_CSV)

    # Drop log_loss and f1_macro (all NaN)
    df = df.drop(columns=["log_loss", "f1_macro"], errors="ignore")

    metadata = {
        "total_results": len(df),
        "datasets": df["dataset"].nunique(),
        "classifiers": sorted(df["classifier"].unique().tolist()),
        "n_folds": int(df["fold"].nunique()),
        "n_repetitions": int(df["repetition"].nunique()),
        "seeds": sorted(df["seed"].unique().tolist()),
    }

    # Convert numeric columns to native Python types
    records = df.to_dict(orient="records")
    for rec in records:
        for k, v in rec.items():
            if pd.isna(v):
                rec[k] = None
            elif isinstance(v, float) and math.isnan(v):
                rec[k] = None
            elif hasattr(v, "item"):  # numpy scalar
                rec[k] = v.item()

    return {"metadata": metadata, "results": records}


# ---------- 2. paired_comparison.json ----------
def generate_paired_comparison():
    df = pd.read_csv(PAIRED_COMPARISON_CSV)

    datasets = []
    for _, row in df.iterrows():
        entry = {
            "dataset": row["dataset"],
            "n_samples": int(row["n_samples"]),
            "n_features": int(row["n_features"]),
            "n_classes": int(row["n_classes"]),
            "acc_AODE": row["acc_AODE"],
            "acc_BoostAODE": row["acc_BoostAODE"],
            "acc_diff": row["acc_diff"],
            "n_spodes_AODE": row["n_spodes_AODE"],
            "n_spodes_BoostAODE": row["n_spodes_BoostAODE"],
            "simplicity_BoostAODE": row["simplicity_BoostAODE"],
            "compression_ratio": row["compression_ratio"],
            "alpha_breakeven": row.get("alpha_breakeven"),
        }
        clc = {}
        for alpha in ALPHAS:
            a_str = str(alpha)
            col_aode = f"CLC_{a_str}_AODE"
            col_boost = f"CLC_{a_str}_BoostAODE"
            col_diff = f"CLC_{a_str}_diff"
            clc[a_str] = {
                "AODE": row[col_aode],
                "BoostAODE": row[col_boost],
                "diff": row[col_diff],
            }
        entry["clc"] = clc
        datasets.append(entry)

    return {"alphas": ALPHAS, "datasets": datasets}


# ---------- 3. statistical_tests.json ----------
def generate_statistical_tests():
    df = pd.read_csv(STATISTICAL_TESTS_CSV)
    tests = []
    for _, row in df.iterrows():
        tests.append({
            "metric": row["metric"],
            "wilcoxon_stat": row["wilcoxon_stat"],
            "p_value": row["p_value"],
            "significant": bool(row["significant"]),
            "wins": int(row["wins_BoostAODE"]),
            "ties": int(row["ties"]),
            "losses": int(row["losses_BoostAODE"]),
        })
    return {"tests": tests}


# ---------- 4. segmented_analysis.json ----------
def generate_segmented_analysis():
    df = pd.read_csv(SEGMENTED_ANALYSIS_CSV)
    segments = []
    for _, row in df.iterrows():
        segments.append({
            "segment": row["segment"],
            "n_datasets": int(row["n_datasets"]),
            "alpha": row["alpha"],
            "wilcoxon_p": row["wilcoxon_p"],
            "significant": bool(row["significant"]),
            "wins": int(row["wins"]),
            "ties": int(row["ties"]),
            "losses": int(row["losses"]),
            "mean_CLC_diff": row["mean_CLC_diff"],
        })
    return {"segments": segments}


# ---------- 5. experiment_summary.json ----------
def generate_experiment_summary(exp_data, paired_data, stats_data):
    # Research questions
    research_questions = {
        "RQ1": (
            "Considerando la metrica CLC_alpha (que combina accuracy y complejidad "
            "del ensemble), ofrece BoostAODE un mejor trade-off "
            "accuracy-complejidad que AODE?"
        ),
        "RQ2": (
            "En que escenarios (alta dimensionalidad, alta correlacion entre "
            "variables) es mas ventajoso usar BoostAODE frente a AODE?"
        ),
        "RQ3": (
            "Cual es la reduccion tipica de complejidad (numero de SPODEs) "
            "que consigue BoostAODE respecto a AODE?"
        ),
        "RQ4": (
            "Existen escenarios donde AODE es suficiente y no merece la pena "
            "el overhead de BoostAODE?"
        ),
        "RQ5": (
            "Cual es el coste computacional adicional de BoostAODE respecto a AODE?"
        ),
    }

    config = {
        "n_folds": exp_data["metadata"]["n_folds"],
        "n_repetitions": exp_data["metadata"]["n_repetitions"],
        "seeds": exp_data["metadata"]["seeds"],
        "classifiers": exp_data["metadata"]["classifiers"],
    }

    # Global stats from the results
    df = pd.read_csv(EXPERIMENTAL_RESULTS_CSV)
    mean_acc = df.groupby("classifier")["accuracy"].mean().to_dict()

    # Mean CLC_0.5 from paired comparison
    pc = pd.read_csv(PAIRED_COMPARISON_CSV)
    mean_clc_05 = {
        "AODE": float(pc["CLC_0.5_AODE"].mean()),
        "BoostAODE": float(pc["CLC_0.5_BoostAODE"].mean()),
    }

    # Win/tie/loss from the accuracy row in statistical tests
    acc_test = next(t for t in stats_data["tests"] if t["metric"] == "accuracy")
    global_stats = {
        "mean_accuracy": {k: round(v, 6) for k, v in mean_acc.items()},
        "mean_CLC_0.5": {k: round(v, 6) for k, v in mean_clc_05.items()},
        "accuracy_wins_BoostAODE": acc_test["wins"],
        "accuracy_ties": acc_test["ties"],
        "accuracy_losses_BoostAODE": acc_test["losses"],
    }

    # Dataset list
    dataset_list = []
    for ds in paired_data["datasets"]:
        dataset_list.append({
            "name": ds["dataset"],
            "n_samples": ds["n_samples"],
            "n_features": ds["n_features"],
            "n_classes": ds["n_classes"],
        })

    return {
        "research_questions": research_questions,
        "config": config,
        "global_stats": global_stats,
        "dataset_list": dataset_list,
        "clc_definition": "CLC_alpha = alpha x accuracy + (1 - alpha) x (1 - n_spodes / n_features)",
    }


# ---------- main ----------
def main():
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    print("Generating JSON data files...\n")

    # 1. Experimental results (large -> compact)
    print("[1/5] experimental_results.json")
    exp_data = generate_experimental_results()
    write_json(os.path.join(OUTPUT_DIR, "experimental_results.json"), exp_data, compact=True)

    # 2. Paired comparison (medium -> compact)
    print("[2/5] paired_comparison.json")
    paired_data = generate_paired_comparison()
    write_json(os.path.join(OUTPUT_DIR, "paired_comparison.json"), paired_data, compact=True)

    # 3. Statistical tests (small -> indented)
    print("[3/5] statistical_tests.json")
    stats_data = generate_statistical_tests()
    write_json(os.path.join(OUTPUT_DIR, "statistical_tests.json"), stats_data, compact=False)

    # 4. Segmented analysis (small -> indented)
    print("[4/5] segmented_analysis.json")
    seg_data = generate_segmented_analysis()
    write_json(os.path.join(OUTPUT_DIR, "segmented_analysis.json"), seg_data, compact=False)

    # 5. Experiment summary (small -> indented)
    print("[5/5] experiment_summary.json")
    summary_data = generate_experiment_summary(exp_data, paired_data, stats_data)
    write_json(os.path.join(OUTPUT_DIR, "experiment_summary.json"), summary_data, compact=False)

    print(f"\nDone. {len(os.listdir(OUTPUT_DIR))} files written to {OUTPUT_DIR}")


if __name__ == "__main__":
    main()
