const getImageUrl = (filePath: string) => {
    return `${process.env.NEXT_PUBLIC_API_URL}/files?path=${filePath}`;
};

export default getImageUrl