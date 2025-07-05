interface Props {
  count: number;
  title: string;
  subtitle: string;
  borderColor: string; // tailwind or css color string
}

const StatsCard = ({ count, title, subtitle, borderColor }: Props) => {
  return (
    <div className="stats-card" style={{ borderColor }}>
      <span className="stats-count">{count}</span>
      <span className="stats-title">{title}</span>
      <span className="stats-subtitle">{subtitle}</span>
    </div>
  );
};

export default StatsCard; 