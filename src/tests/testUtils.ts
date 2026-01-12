export const readBlobAsText = (blob: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        resolve(reader.result);
      } else {
        reject(new Error("Failed to read blob as text"));
      }
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsText(blob);
  });
};
