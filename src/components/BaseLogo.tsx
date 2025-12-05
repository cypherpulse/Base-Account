const BaseLogo = ({ className = "w-8 h-8" }: { className?: string }) => {
  return (
    <div className={`${className} bg-white flex items-center justify-center rounded`}>
      <img src="/favicon-32x32.png" alt="Logo" className="w-3/4 h-3/4 object-contain" />
    </div>
  );
};

export default BaseLogo;
