import { Icon, type IconName } from "./icon";
export function EmptyState({ title, description, icon = "classes" }: { title: string; description: string; icon?: IconName }) {
  return <div className="empty-state"><span className="empty-icon"><Icon name={icon} width={28} height={28} /></span><h3>{title}</h3><p>{description}</p></div>;
}
