// src/lib/fakeNetwork.ts

export async function fakeNetwork<T>(promise: Promise<T>, min = 200, max = 1200) {
  // Random delay between min and max (milliseconds)
  const delay = Math.floor(Math.random() * (max - min + 1)) + min;
  await new Promise(res => setTimeout(res, delay));

  // Randomly simulate a network error (10% chance)
  if (Math.random() < 0.1) {
    throw new Error("Simulated network error");
  }

  // Return the original promise result after delay
  return promise;
}
