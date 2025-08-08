const Card: React.FC<{ title: string; children: React.ReactNode }> = ({
  title,
  children,
}) => (
  <div className="bg-white rounded-lg shadow-md px-10 py-4 mb-6 w-full">
    <h3 className="text-lg font-semibold mb-3 text-[#48038a]">{title}</h3>
    <div className="space-y-2">{children}</div>
  </div>
);

export default Card;
