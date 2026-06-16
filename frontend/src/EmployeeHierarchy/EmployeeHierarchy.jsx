// import React, { useEffect, useRef, useState } from "react";
// import * as d3 from "d3";
// // import Header from "../components/Header"; // Assuming 'Header' is imported correctly in your original project

// // Hardcoded organizational hierarchy data with names
// const hardcodedOrgData = {
//   name: "Chairperson",
//   person: "Aarti Grover",
//   type: "top",
//   children: [
//     {
//       name: "Chief Executive Officer",
//       person: "Anil Menon",
//       type: "level1",
//       children: [
//         {
//           name: "BUSINESS",
//           person: null, // No single person for a heading
//           type: "heading",
//           children: [
//             {
//               name: "1 GSD - Govt. Solution Division",
//               person: "Satihs Jorapur",
//               type: "division",
//               children: [
//                 { name: "Sales", person: "Dhanya", type: "department" },
//                 { name: "Pre Sales", person: "Ravi Sinha", type: "department" },
//                 { name: "Solutions", person: "Pranesh Deshpande", type: "department" },
//                 { name: "Strategic Initiatives", person: null, type: "department" },
//                 { name: "Delivery & Support", person: null, type: "department" },
//                 { name: "Strategic Support", person: null, type: "department" },
//                 { name: "Operations", person: null, type: "department" },
//               ],
//             },
//             {
//               name: "2 BSD - Business Solution Division",
//               person: "Amarnath Chattopadhyay",
//               type: "division",
//               children: [
//                 { name: "Sales", person: "Satish Shetty", type: "department" },
//                 { name: "Delivery & Support", person: "Mahesh Nair", type: "department" },
//                 { name: "Product & Development", person: null, type: "department" },
//                 { name: "Smart Cities & Ports", person: "Vaibhav Chauhan", type: "department" },
//                 { name: "Industry Solutions", person: "Anup Desai", type: "department" },
//                 { name: "Operations", person: null, type: "department" },
//               ],
//             },
//             {
//               name: "3 ESD - Enterprise Sales Division",
//               person: "Sudhir Shetty",
//               type: "division",
//               children: [
//                 { name: "Sales", person: null, type: "department" }, // Assuming Sudhir Shetty is the division head
//               ],
//             },
//           ],
//         },
//         {
//           name: "D - CMS TRAFFIC LTD.",
//           person: "Vaibhav Chauhan",
//           type: "heading",
//           children: [],
//         },
//         {
//           name: "C - BUSINESS FUNCTIONS",
//           person: null, // No single person for a heading
//           type: "heading",
//           children: [
//             { name: "Finance & Accounts", person: "Ganesh Pillutla", type: "department" },
//             { name: "Human Resource & Administration", person: "Manisha Patil", type: "department" },
//             { name: "Commercial", person: "Ravindrakumar Jha", type: "department" },
//             { name: "Marketing & Communication", person: "Damini Singh", type: "department" },
//             { name: "Alliance & Eco System", person: "Sudhir Shetty", type: "department" },
//             { name: "PMO", person: "Jayanta Chakraborty", type: "department" },
//             { name: "Purchase", person: "Santosh Dhende", type: "department" },
//             { name: "OEG & Stores", person: "Nitesh Rane", type: "department" },
//             { name: "CS & Legal", person: "Somnath Shah", type: "department" },
//             { name: "Quality", person: "Rajashree Mohite", type: "department" },
//             { name: "Internal IT", person: "Rahul Lad", type: "department" },
//             { name: "Internal Audit", person: null, type: "department" },
//           ],
//         },
//         {
//           name: "B - PRACTICES",
//           person: null, // No single person for a heading
//           type: "heading",
//           children: [
//             { name: "Digital", person: "Balwinder Singh Cheema", type: "department" },
//             { name: "SSD - Software Solution Division", person: "Mathimaran P", type: "department" },
//             { name: "IT Infra Services", person: "Rajendra Nikumbh", type: "department" },
//           ],
//         },
//       ],
//     },
//   ],
// };

// function EmployeeHierarchy() {
//   const ref = useRef();
//   const [data, setData] = useState(hardcodedOrgData);

//   useEffect(() => {
//     drawChart(data);
//   }, [data]);

//   const toggleChildren = (d) => {
//     if (d.children) {
//       d._children = d.children;
//       d.children = null;
//     } else {
//       d.children = d._children;
//       d._children = null;
//     }
//     // Deep clone the state to force a re-render and re-evaluate D3
//     setData({ ...data });
//   };

//   const drawChart = (data) => {
//     const rectWidth = 180;
//     const rectHeight = 60;
//     const textXOffset = 10;
//     const fontSize = "10px";
//     const horizontalGapBetweenBranches = 200;
//     const verticalGapBetweenLevels = 100;
//     const verticalGapBetweenDepartments = 70;

//     const root = d3.hierarchy(data);

//     // Initial tree layout
//     const treeLayout = d3.tree().nodeSize([1, 1]);
//     treeLayout(root);

//     // Custom positioning logic
//     root.eachBefore((node) => {
//       if (!node.children || node.children.length === 0) return;

//       const shouldStackChildrenVertically =
//         node.data.type === "division" ||
//         (node.data.type === "heading" && node.data.name !== "BUSINESS");

//       if (shouldStackChildrenVertically) {
//         // Vertical stacking logic for divisions/non-business headings
//         let currentChildY =
//           node.y + rectHeight / 2 + verticalGapBetweenDepartments / 2;
//         const parentX = node.x;

//         node.children.forEach((child) => {
//           child.x = parentX;
//           child.y = currentChildY;
//           currentChildY += rectHeight + verticalGapBetweenDepartments * 0.2;
//         });
//       } else {
//         // Horizontal spacing logic (for top levels and BUSINESS heading)
//         const numChildren = node.children.length;
//         if (numChildren > 0) {
//           const totalChildrenSpan =
//             numChildren * rectWidth +
//             (numChildren - 1) * horizontalGapBetweenBranches;
//           let startX =
//             node.x - totalChildrenSpan / 2 + rectWidth / 2;

//           node.children.forEach((child) => {
//             child.x = startX;
//             child.y = node.y + verticalGapBetweenLevels;
//             startX += rectWidth + horizontalGapBetweenBranches;
//           });
//         }
//       }
//     });

//     const nodes = root.descendants();
//     const links = root.links();

//     // Determine viewport size
//     const minX = d3.min(nodes, (d) => d.x);
//     const maxX = d3.max(nodes, (d) => d.x);
//     const minY = d3.min(nodes, (d) => d.y);
//     const maxY = d3.max(nodes, (d) => d.y);

//     const viewWidth = maxX - minX + rectWidth * 2;
//     const viewHeight = maxY - minY + rectHeight * 2;

//     const svg = d3.select(ref.current);
//     svg.selectAll("*").remove();

//     const mainGroup = svg
//       .attr("viewBox", `0 0 ${viewWidth} ${viewHeight}`)
//       .attr("preserveAspectRatio", "xMidYMid meet")
//       .append("g")
//       .attr(
//         "transform",
//         `translate(${-minX + rectWidth}, ${-minY + rectHeight / 2})`
//       );

//     // Add zoom functionality
//     const zoom = d3.zoom().on("zoom", (event) => {
//       mainGroup.attr("transform", event.transform);
//     });
//     svg.call(zoom);

//     // Draw links with transitions
//     mainGroup
//       .selectAll(".link")
//       .data(links, (d) => d.target.data.name)
//       .join(
//         (enter) =>
//           enter
//             .append("path")
//             .attr("class", "link")
//             .attr("d", (d) => {
//               const o = { x: d.source.x, y: d.source.y };
//               return d3.linkVertical().x(() => o.x).y(() => o.y)({ source: o, target: o });
//             })
//             .call((enter) =>
//               enter
//                 .transition()
//                 .duration(500)
//                 .attr("d", (d) =>
//                   d3.linkVertical().x((n) => n.x).y((n) => n.y)(d)
//                 )
//             ),
//         (update) =>
//           update.call((update) =>
//             update
//               .transition()
//               .duration(500)
//               .attr("d", (d) =>
//                 d3.linkVertical().x((n) => n.x).y((n) => n.y)(d)
//               )
//           ),
//         (exit) =>
//           exit.call((exit) =>
//             exit
//               .transition()
//               .duration(500)
//               .attr("d", (d) => {
//                 const o = { x: d.source.x, y: d.source.y };
//                 return d3.linkVertical().x(() => o.x).y(() => o.y)({ source: o, target: o });
//               })
//               .remove()
//           )
//       )
//       .attr("fill", "none")
//       .attr("stroke", "#9CA3AF")
//       .attr("stroke-width", 2);

//     // Draw nodes with transitions
//     const node = mainGroup
//       .selectAll(".node")
//       .data(nodes, (d) => d.data.name);

//     const nodeEnter = node
//       .enter()
//       .append("g")
//       .attr("class", "node")
//       .attr("transform", (d) => `translate(${d.parent ? d.parent.x : d.x},${d.parent ? d.parent.y : d.y})`)
//       .on("click", (event, d) => {
//         toggleChildren(d.data);
//       });

//     // Append Rectangles
//     nodeEnter
//       .append("rect")
//       .attr("width", rectWidth)
//       .attr("height", rectHeight)
//       .attr("rx", 10)
//       .attr("ry", 10)
//       .attr("fill", (d) => {
//         switch (d.data.type) {
//           case "top":
//             return "#616161ff";
//           case "level1":
//             return "#575858ff";
//           case "heading":
//             return "#a10000ff";
//           case "division":
//             return "#D1D5DB";
//           case "department":
//             return "#707070ff";
//           default:
//             return "#F3F4F6";
//         }
//       })
//       .attr("stroke", (d) => {
//         switch (d.data.type) {
//           case "top":
//           case "level1":
//             return "#1F2937";
//           case "heading":
//             return "#FBBF24";
//           case "division":
//             return "#9CA3AF";
//           case "department":
//             return "#2563EB";
//           default:
//             return "#9CA3AF";
//         }
//       });

//     // Append Node Name (Role/Division) - Positioned slightly above center
//     nodeEnter
//       .append("text")
//       .attr("class", "node-name")
//       .attr("x", textXOffset)
//       .attr("y", rectHeight / 2)
//       .attr("dy", "-0.2em") // Adjust up
//       .style("font-size", fontSize)
//       .style("font-weight", "bold")
//       .style("fill", (d) => {
//         switch (d.data.type) {
//           case "top":
//           case "level1":
//           case "heading":
//           case "department":
//             return "#FFFFFF";
//           case "division":
//             return "#1F2937";
//           default:
//             return "#1F2937";
//         }
//       })
//       .text((d) => d.data.name);

//     // Append Person Name - Positioned slightly below center
//     nodeEnter
//       .filter(d => d.data.person) // Only create text for nodes that have a person
//       .append("text")
//       .attr("class", "person-name")
//       .attr("x", textXOffset)
//       .attr("y", rectHeight / 2)
//       .attr("dy", "1em") // Adjust down
//       .style("font-size", fontSize)
//       .style("font-style", "italic")
//       .style("fill", (d) => {
//         // Use a distinct color, like a brighter version of the text color
//         if (d.data.type === 'division') return "#374151"; // Darker text for light background
//         return "#FBBF24"; // Yellow for dark backgrounds
//       })
//       .text((d) => d.data.person);


//     // Apply transitions to entering nodes
//     nodeEnter
//       .transition()
//       .duration(500)
//       .attr("transform", (d) => `translate(${d.x - rectWidth / 2},${d.y - rectHeight / 2})`);

//     // Apply transitions to updating nodes
//     node
//       .transition()
//       .duration(500)
//       .attr("transform", (d) => `translate(${d.x - rectWidth / 2},${d.y - rectHeight / 2})`);

//     // Apply transitions to exiting nodes
//     node.exit()
//       .transition()
//       .duration(500)
//       .attr("transform", (d) => `translate(${d.parent ? d.parent.x : d.x},${d.parent ? d.parent.y : d.y})`)
//       .remove();
//   };

//   return (
//     <>
//       {/* <Header /> */}
//       <div className="p-8 bg-gray-50 min-h-screen pt-20">
//         <h1 className="text-3xl font-bold mb-6 text-gray-800 text-center">
//           Organizational Hierarchy
//         </h1>
//         <div
//           style={{
//             width: "100%",
//             overflowX: "auto",
//             display: "flex",
//             justifyContent: "center",
//           }}
//         >
//           <svg
//             ref={ref}
//             // Adjusted height slightly for a bigger view area
//             style={{ width: "100%", minWidth: "1600px", height: "150vh" }}
//           ></svg>
//         </div>
//       </div>
//     </>
//   );
// }

// export default EmployeeHierarchy;



// OrgChart.jsx
import React, { useEffect, useRef, useState, useMemo } from "react";

/**
 * Sample data (from your message). You can also pass this as a prop.
 */
const initialData = {
  name: "Chairperson",
  person: "Aarti Grover",
  type: "top",
  children: [
    {
      name: "Chief Executive Officer",
      person: "Anil Menon",
      type: "level1",
      children: [
        {
          name: "BUSINESS",
          person: null,
          type: "heading",
          children: [
            {
              name: "1 GSD - Govt. Solution Division",
              person: "Satihs Jorapur",
              type: "division",
              children: [
                { name: "Sales", person: "Dhanya", type: "department" },
                { name: "Pre Sales", person: "Ravi Sinha", type: "department" },
                { name: "Solutions", person: "Pranesh Deshpande", type: "department" },
                { name: "Strategic Initiatives", person: null, type: "department" },
                { name: "Delivery & Support", person: null, type: "department" },
                { name: "Strategic Support", person: null, type: "department" },
                { name: "Operations", person: null, type: "department" },
              ],
            },
            {
              name: "2 BSD - Business Solution Division",
              person: "Amarnath Chattopadhyay",
              type: "division",
              children: [
                { name: "Sales", person: "Satish Shetty", type: "department" },
                { name: "Delivery & Support", person: "Mahesh Nair", type: "department" },
                { name: "Product & Development", person: null, type: "department" },
                { name: "Smart Cities & Ports", person: "Vaibhav Chauhan", type: "department" },
                { name: "Industry Solutions", person: "Anup Desai", type: "department" },
                { name: "Operations", person: null, type: "department" },
              ],
            },
            {
              name: "3 ESD - Enterprise Sales Division",
              person: "Sudhir Shetty",
              type: "division",
              children: [{ name: "Sales", person: null, type: "department" }],
            },
          ],
        },
        {
          name: "D - CMS TRAFFIC LTD.",
          person: "Vaibhav Chauhan",
          type: "heading",
          children: [],
        },
        {
          name: "C - BUSINESS FUNCTIONS",
          person: null,
          type: "heading",
          children: [
            { name: "Finance & Accounts", person: "Ganesh Pillutla", type: "department" },
            { name: "Human Resource & Administration", person: "Manisha Patil", type: "department" },
            { name: "Commercial", person: "Ravindrakumar Jha", type: "department" },
            { name: "Marketing & Communication", person: "Damini Singh", type: "department" },
            { name: "Alliance & Eco System", person: "Sudhir Shetty", type: "department" },
            { name: "PMO", person: "Jayanta Chakraborty", type: "department" },
            { name: "Purchase", person: "Santosh Dhende", type: "department" },
            { name: "OEG & Stores", person: "Nitesh Rane", type: "department" },
            { name: "CS & Legal", person: "Somnath Shah", type: "department" },
            { name: "Quality", person: "Rajashree Mohite", type: "department" },
            { name: "Internal IT", person: "Rahul Lad", type: "department" },
            { name: "Internal Audit", person: null, type: "department" },
          ],
        },
        {
          name: "B - PRACTICES",
          person: null,
          type: "heading",
          children: [
            { name: "Digital", person: "Balwinder Singh Cheema", type: "department" },
            { name: "SSD - Software Solution Division", person: "Mathimaran P", type: "department" },
            { name: "IT Infra Services", person: "Rajendra Nikumbh", type: "department" },
          ],
        },
      ],
    },
  ],
};

/**
 * Utility: assign stable unique ids to nodes (if they don't exist).
 */
function assignIds(node, prefix = "n", counter = { i: 1 }) {
  if (!node) return null;
  if (!node.id) node.id = `${prefix}${counter.i++}`;
  if (Array.isArray(node.children)) {
    node.children.forEach((c) => assignIds(c, prefix, counter));
  } else {
    node.children = [];
  }
  return node;
}

/**
 * Color / style map by node type (customize easily)
 */
const typeStyles = {
  top: {
    bg: "bg-gray-800",
    fg: "text-white",
    accent: "border-yellow-400",
  },
  level1: {
    bg: "bg-red-700",
    fg: "text-white",
    accent: "border-red-600",
  },
  heading: {
    bg: "bg-gray-100",
    fg: "text-gray-900",
    accent: "border-gray-300",
  },
  division: {
    bg: "bg-gray-700",
    fg: "text-white",
    accent: "border-amber-400",
  },
  department: {
    bg: "bg-gray-600",
    fg: "text-white",
    accent: "border-gray-400",
  },
  default: {
    bg: "bg-gray-200",
    fg: "text-gray-800",
    accent: "border-gray-300",
  },
};

/**
 * OrgNode - recursive rendering
 */
function OrgNode({
  node,
  expanded,
  toggle,
  registerRef,
  depth = 0,
  onNodeClick,
}) {
  const hasChildren = node.children && node.children.length > 0;
  const style = typeStyles[node.type] || typeStyles.default;

  return (
    <div className="flex flex-col items-center">
      <div
        ref={(el) => registerRef(node.id, el)}
        className={`relative w-64 min-h-[56px] transition-transform duration-150 ${style.bg} ${style.fg} border ${style.accent} rounded-md shadow-md p-3 flex flex-col items-start`}
        title={node.name + (node.person ? ` — ${node.person}` : "")}
      >
        <div className="flex items-start w-full justify-between gap-2">
          <div className="flex flex-col">
            <div className="font-semibold leading-tight text-sm">
              {node.name}
            </div>
            <div className="text-xs opacity-90 mt-1">
              {node.person || <span className="italic text-gray-300">—</span>}
            </div>
          </div>

          {/* controls */}
          <div className="flex flex-col items-end gap-1">
            {hasChildren && (
              <button
                onClick={() => toggle(node.id)}
                className="px-2 py-1 text-xs rounded bg-white/10 hover:bg-white/20"
                aria-label={expanded.has(node.id) ? "Collapse" : "Expand"}
              >
                {expanded.has(node.id) ? "−" : "+"}
              </button>
            )}
            <button
              onClick={() => onNodeClick(node)}
              className="text-[10px] px-2 py-1 mt-1 rounded bg-white/10 hover:bg-white/20"
            >
              View
            </button>
          </div>
        </div>
      </div>

      {/* children container */}
      {hasChildren && expanded.has(node.id) && (
        <div className="relative mt-6">
          <div className="absolute left-1/2 transform -translate-x-1/2 top-0 w-px h-6 bg-gray-300" />
          <div className="flex flex-wrap gap-6 mt-6 items-start justify-center max-w-full">
            {node.children.map((c) => (
              <OrgNode
                key={c.id}
                node={c}
                expanded={expanded}
                toggle={toggle}
                registerRef={registerRef}
                depth={depth + 1}
                onNodeClick={onNodeClick}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Main OrgChart component
 */
export default function EmployeeHierarchy({ data = initialData }) {
  // Clone data and ensure ids
  const tree = useMemo(() => {
    const clone = JSON.parse(JSON.stringify(data));
    assignIds(clone);
    return clone;
  }, [data]);

  // expanded node ids
  const [expanded, setExpanded] = useState(new Set([tree.id])); // expand root by default

  // map of id -> ref DOM element
  const nodesRef = useRef(new Map());

  // connections state (array of paths)
  const [connections, setConnections] = useState([]);

  // register ref
  const registerRef = (id, el) => {
    if (!el) {
      nodesRef.current.delete(id);
    } else {
      nodesRef.current.set(id, el);
    }
  };

  const toggle = (id) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // click handler (you can expand this to show modal)
  const onNodeClick = (node) => {
    // simple demo alert — replace with modal or side-panel as needed
    alert(`${node.name}${node.person ? `\n\n${node.person}` : ""}`);
  };

  /**
   * Recompute connector lines after render and when expanded changes
   * We'll draw cubic Bezier curves from parent's bottom center to child's top center.
   */
  useEffect(() => {
    const lines = [];
    const map = nodesRef.current;

    // function to traverse visible nodes and add lines
    function traverse(node) {
      const parentEl = map.get(node.id);
      if (!parentEl) {
        // node not mounted (collapsed or not rendered)
      } else if (node.children && node.children.length > 0 && expanded.has(node.id)) {
        node.children.forEach((child) => {
          const childEl = map.get(child.id);
          if (childEl) {
            const parentRect = parentEl.getBoundingClientRect();
            const childRect = childEl.getBoundingClientRect();
            // TODO: SVG coords need to be relative to container viewport
            // We'll compute using container bounding rect
            const containerRect = containerRef.current?.getBoundingClientRect();
            if (!containerRect) return;

            const startX = parentRect.left + parentRect.width / 2 - containerRect.left;
            const startY = parentRect.top + parentRect.height - containerRect.top;
            const endX = childRect.left + childRect.width / 2 - containerRect.left;
            const endY = childRect.top - containerRect.top;

            // control points for smooth curve
            const dx = Math.abs(endX - startX);
            const controlY = startY + Math.max(30, dx * 0.4);

            const d = `M ${startX} ${startY} C ${startX} ${controlY} ${endX} ${controlY} ${endX} ${endY}`;

            lines.push({ d });
          }
          // continue traverse for deeper visible children
          traverse(child);
        });
      } else {
        // still traverse children for completeness (but they won't be visible if parent collapsed)
        if (node.children) {
          node.children.forEach((c) => traverse(c));
        }
      }
    }

    setTimeout(() => {
      // small timeout to let layout settle (safe in sync rendering)
      try {
        lines.length = 0;
        traverse(tree);
        setConnections([...lines]);
      } catch (e) {
        // ignore measurement errors
      }
    }, 0);
    // recompute on window resize
    const onResize = () => {
      setConnections([]); // trigger recompute next render
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [expanded, tree]);

  // container ref for coordinate system
  const containerRef = useRef(null);

  return (
    <div className="w-full min-h-[60vh] py-10 px-4">
      <div className="max-w-[1400px] mx-auto relative">
        <h2 className="text-3xl font-bold text-center mb-8">Organizational Hierarchy</h2>

        {/* Chart area */}
        <div
          ref={containerRef}
          className="relative bg-white p-8 rounded-lg shadow-inner overflow-visible"
          style={{ minHeight: 420 }}
        >
          {/* SVG overlay for connectors */}
          <svg
            className="absolute inset-0 pointer-events-none"
            style={{ width: "100%", height: "100%", overflow: "visible" }}
          >
            <defs>
              <filter id="soft" x="-50%" y="-50%" width="200%" height="200%">
                <feDropShadow dx="0" dy="1" stdDeviation="1" floodColor="#9CA3AF" floodOpacity="0.4" />
              </filter>
            </defs>

            {connections.map((c, idx) => (
              <path key={idx} d={c.d} fill="none" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            ))}
          </svg>

          {/* Center the root */}
          <div className="flex justify-center">
            <OrgNode
              node={tree}
              expanded={expanded}
              toggle={toggle}
              registerRef={registerRef}
              onNodeClick={onNodeClick}
            />
          </div>
        </div>

        {/* Footer / small legend */}
        <div className="mt-6 flex justify-center gap-4 text-sm text-gray-500">
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 rounded-sm bg-gray-800" />
            <span>Top</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 rounded-sm bg-red-700" />
            <span>Executive</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 rounded-sm bg-gray-700" />
            <span>Division</span>
          </div>
        </div>
      </div>
    </div>
  );
}
