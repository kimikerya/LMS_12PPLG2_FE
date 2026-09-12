import { studentRequestTime } from "./data";
import { studentClasses, studentContent } from "./data";
import { StudentContentList } from "./content-list";
import { learningLabels } from "./helpers";
import type { Kind } from "./types";
export async function StudentLearningPage({kind}:{kind:Kind}) {
 const [items,classes]=await Promise.all([studentContent(kind),studentClasses()]);
 return <div className="student-workspace"><div className="page-heading"><div><h1>{learningLabels[kind]} Saya</h1><p>{learningLabels[kind]} dari seluruh kelas yang Anda ikuti.</p></div><span className="count-pill">{items.length} {learningLabels[kind].toLowerCase()}</span></div><StudentContentList kind={kind} items={items} classNames={Object.fromEntries(classes.map(c=>[c.id,c.title]))} now={studentRequestTime()}/></div>;
}
