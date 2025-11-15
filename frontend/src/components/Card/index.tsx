const Card: React.FC<{
  title?: string | { className: string; label: string };
  children: React.ReactNode;
  classNameContainer?: string;
  classNameContent?: string;
  noShadow?: boolean;
}> = ({ title, children, classNameContent, classNameContainer, noShadow }) => (
  <div
    className={`bg-white rounded-lg px-4 py-2 w-full ${classNameContainer} ${
      !noShadow && 'shadow-md'
    }`}
  >
    {title &&
      (typeof title === 'string' ? (
        <h3 className="text-md font-bold text-primary">{title}</h3>
      ) : (
        <h3 className={`text-md font-bold text-primary ${title.className}`}>
          {title.label}
        </h3>
      ))}
    <div className={`text-secondary ${classNameContent}`}>{children}</div>
  </div>
);

export default Card;
