const Card: React.FC<{
  title?: string | { className: string; label: string };
  children: React.ReactNode;
  classNameContainer?: string;
  classNameContent?: string;
}> = ({ title, children, classNameContent, classNameContainer }) => (
  <div
    className={`bg-white rounded-lg shadow-md px-4 py-2 w-full ${classNameContainer}`}
  >
    {title &&
      (typeof title === 'string' ? (
        <h3 className="text-md font-bold text-primary">{title}</h3>
      ) : (
        <h3 className={`text-md font-bold text-primary ${title.className}`}>
          {title.label}
        </h3>
      ))}
    <div className={`text-primary ${classNameContent}`}>{children}</div>
  </div>
);

export default Card;
