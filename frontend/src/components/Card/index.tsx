const Card: React.FC<{
  title?: string;
  children: React.ReactNode;
  classNameContent?: string;
}> = ({ title, children, classNameContent }) => (
  <div className="bg-white rounded-lg shadow-md px-4 py-2 w-full">
    {title && <h3 className="text-lg font-semibold text-[#48038a]">{title}</h3>}
    <div className={`text-[#48038a] ${classNameContent}`}>{children}</div>
  </div>
);

export default Card;
