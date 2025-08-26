const Card: React.FC<{
  title?: string;
  children: React.ReactNode;
  classNameContainer?: string;
  classNameContent?: string;
}> = ({ title, children, classNameContent, classNameContainer }) => (
  <div
    className={`bg-white rounded-lg shadow-md px-4 py-2 w-full ${classNameContainer}`}
  >
    {title && <h3 className="text-lg font-bold text-primary">{title}</h3>}
    <div className={`text-primary ${classNameContent}`}>{children}</div>
  </div>
);

export default Card;
