/**
 * Spam scores for the 1,115 messages in the 80/20 test split.
 *
 * These are SIMULATED so that, at a threshold of 0.50, they reproduce the measured
 * confusion matrix exactly (TP 130, FN 19, FP 1, TN 965). Other thresholds are
 * illustrative. To make every threshold real, export the model's probabilities:
 *
 *   probs = model.predict_proba(X_test)[:, 1]
 *   json.dump({"spam": probs[y_test == 1].tolist(),
 *              "ham":  probs[y_test == 0].tolist()}, open("spam-scores.json", "w"))
 *
 * then import that JSON here and set SCORES_ARE_SIMULATED to false.
 */
export const SCORES_ARE_SIMULATED = true;

function simulate() {
  const spam: number[] = [];
  const ham: number[] = [];
  for (let i = 0; i < 130; i++) spam.push(1 - 0.5 * Math.pow(1 - (i + 0.5) / 130, 2.2));
  for (let i = 0; i < 19; i++) spam.push(0.5 - 0.42 * Math.pow((i + 0.5) / 19, 1.6));
  for (let i = 0; i < 965; i++) ham.push(0.5 * Math.pow((i + 0.5) / 965, 3.2));
  ham.push(0.61);
  return { spam, ham };
}

export const SPAM_SCORES: { spam: number[]; ham: number[] } = simulate();
