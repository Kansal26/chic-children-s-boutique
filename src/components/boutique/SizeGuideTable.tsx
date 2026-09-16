export function SizeGuideTable() {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left border-collapse">
        <thead>
          <tr className="border-b border-border/50 text-[0.6875rem] uppercase tracking-[0.1em] text-muted-foreground">
            <th className="py-3 px-2 font-medium">Size</th>
            <th className="py-3 px-2 font-medium">Age</th>
            <th className="py-3 px-2 font-medium">Height (cm)</th>
            <th className="py-3 px-2 font-medium">Chest (cm)</th>
          </tr>
        </thead>
        <tbody className="text-foreground">
          <tr className="border-b border-border/30">
            <td className="py-3 px-2">0-3M</td>
            <td className="py-3 px-2">0-3 Months</td>
            <td className="py-3 px-2">56-62</td>
            <td className="py-3 px-2">41-43</td>
          </tr>
          <tr className="border-b border-border/30">
            <td className="py-3 px-2">3-6M</td>
            <td className="py-3 px-2">3-6 Months</td>
            <td className="py-3 px-2">62-68</td>
            <td className="py-3 px-2">43-45</td>
          </tr>
          <tr className="border-b border-border/30">
            <td className="py-3 px-2">6-12M</td>
            <td className="py-3 px-2">6-12 Months</td>
            <td className="py-3 px-2">68-80</td>
            <td className="py-3 px-2">45-49</td>
          </tr>
          <tr className="border-b border-border/30">
            <td className="py-3 px-2">1-2Y</td>
            <td className="py-3 px-2">1-2 Years</td>
            <td className="py-3 px-2">80-92</td>
            <td className="py-3 px-2">49-53</td>
          </tr>
          <tr>
            <td className="py-3 px-2">2-4Y</td>
            <td className="py-3 px-2">2-4 Years</td>
            <td className="py-3 px-2">92-104</td>
            <td className="py-3 px-2">53-56</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
