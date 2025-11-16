// components/FilePreview.js
export default function FilePreview({ path, mimetype }) {
  const getFileIcon = () => {
    if (mimetype?.includes('image')) return 'image';
    if (mimetype === 'application/pdf') return 'pdf';
    if (mimetype?.includes('word')) return 'doc';
    if (mimetype?.includes('sheet')) return 'sheet';
    return 'file';
  };

  const icon = getFileIcon();

  return (
    <div className="w-20 h-20 bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center overflow-hidden">
      {icon === 'image' && (
        <img src={path} alt="preview" className="w-full h-full object-cover" />
      )}
      {icon === 'pdf' && (
        <iframe src={path} className="w-full h-full" title="PDF" />
      )}
      {icon === 'doc' && (
        <div className="text-blue-600 font-bold text-xs">DOC</div>
      )}
      {icon === 'sheet' && (
        <div className="text-green-600 font-bold text-xs">XLS</div>
      )}
      {icon === 'file' && (
        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      )}
    </div>
  );
}