/**
 * Fetches data from a specified URL and returns it as an array of the specified type.
 *
 * @param url - The URL from which to fetch data.
 * @param revalidate - The revalidation time in seconds for caching purposes.
 * @returns A promise that resolves to an array of the specified type `T` if the fetch is successful.
 * @throws An error if the fetch fails or the response status indicates a failure.
 */
export async function fetchData<T>(url: string, revalidate: number): Promise<T[]> {
  const response = await fetch(url, {
    next: { revalidate: revalidate },
  });
  const data = await response.json();

  if (data.status === "1") {
    return data.result as T[];
  } else {
    throw new Error(data.message || "Failed to fetch data");
  }
}

/**
 * Delays the execution of code by a specified number of milliseconds.
 *
 * @param ms - The number of milliseconds to delay.
 * @returns A promise that resolves after the specified delay.
 */
export async function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
