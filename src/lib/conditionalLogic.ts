export function shouldShowQuestion(answers: Record<string, any>, condition?: { dependsOn: string; value: any }) {
  if (!condition) return true;
  return answers[condition.dependsOn] === condition.value;
}
