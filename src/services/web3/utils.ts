import { ExtendedTransaction } from "~~/types/utils";

export async function fetchData(url: string, revalidate: number): Promise<ExtendedTransaction[]> {
  const response = await fetch(url, {
    next: { revalidate: revalidate },
  });
  const data = await response.json();

  if (data.status === "1") {
    return data.result as ExtendedTransaction[];
  } else {
    throw new Error(data.message || "Failed to fetch data");
  }
}

export async function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
