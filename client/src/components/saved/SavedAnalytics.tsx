import { Card } from "@/components/ui/card";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis } from "recharts";

interface SavedAnalyticsProps {
  data: any[];
  domainData: any[];
}

export function SavedAnalytics({ data, domainData }: SavedAnalyticsProps) {
  const COLORS = ["#A855F7", "#3B82F6", "#10B981"];

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass-card border-white/10 p-2 shadow-2xl backdrop-blur-xl">
          <p className="text-[10px] font-bold text-primary uppercase tracking-widest mb-1">
            {payload[0].name}
          </p>
          <p className="text-sm font-bold">
            {payload[0].value} ({((payload[0].value / data.reduce((a, b) => a + b.value, 0)) * 100).toFixed(0)}%)
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      <Card className="glass-card border-white/5 p-6 h-[250px] flex flex-col">
        <h4 className="text-[10px] font-bold text-primary uppercase tracking-widest mb-4">Saved Post Types</h4>
        <div className="flex-1 min-h-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {data.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="rgba(255,255,255,0.05)" />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card className="glass-card border-white/5 p-6 h-[250px] flex flex-col">
        <h4 className="text-[10px] font-bold text-primary uppercase tracking-widest mb-4">Top Saved Domains</h4>
        <div className="flex-1 min-h-0">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={domainData}>
              <XAxis dataKey="name" hide />
              <YAxis hide />
              <Tooltip 
                cursor={{ fill: 'rgba(168, 85, 247, 0.1)' }}
                content={({ active, payload }: any) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="glass-card border-white/10 p-2">
                        <p className="text-[10px] font-bold text-primary mb-1">{payload[0].payload.name}</p>
                        <p className="text-sm font-bold">{payload[0].value} posts</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar dataKey="value" fill="#A855F7" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
}
