
export const getFileExtension = (fileName: string): string => {
  const lastDotIndex = fileName.lastIndexOf('.');
  return lastDotIndex > 0 ? fileName.substring(lastDotIndex) : '';
};

export const createRenamedFile = (originalFile: File, newName: string): File => {
  const extension = getFileExtension(originalFile.name);
  const finalName = newName + extension;
  return new File([originalFile], finalName, { type: originalFile.type });
};

export const getNameWithoutExtension = (fileName: string): string => {
  const lastDotIndex = fileName.lastIndexOf('.');
  return lastDotIndex > 0 ? fileName.substring(0, lastDotIndex) : fileName;
};
