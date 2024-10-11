import { toast } from 'react-toastify';

const useDownloadFile = ({ name, src }: { src: string; name: string }) => {
    const handleDownload = async () => {
        fetch(src)
            .then((response) => response.arrayBuffer())
            .then((buffer) => {
                const url = window.URL.createObjectURL(new Blob([buffer]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', name);
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            })
            .catch((e) => {
                console.log(e);
                toast.error('Lỗi khi tải file');
            });
    };

    return handleDownload;
};

export default useDownloadFile;
