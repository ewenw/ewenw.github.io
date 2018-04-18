/*d3.json("navigation.json", function(error, data) {
    console.log(data); // this is your data
});
*/

const width = window.innerWidth;
const height = window.innerHeight;

     
const nodes = [ 
  { id: "portfolio", link: "", label: "Projects", level: 1 },
  { id: "games", link: "", label: "Games", level: 2 },
  { id: "software", link: "", label: "Software", level: 2 },
  { id: "research", link: "", label: "Research", level: 2 },
  { id: "optimal", link: "https://github.com/ewenw/OptimalDesign", label: "Optimal Design", level: 3 },
  { id: "rocket", link: "https://play.google.com/store/apps/details?id=com.ween.rocket&hl=en_US", label: "Land the Rocket", level: 3 },
  { id: "evorite", link: "https://play.google.com/store/apps/details?id=com.complex51.evorite", label: "Evorite", level: 3 }
];

const links = [
  { target: "games", source: "portfolio" , strength: 0.8 },
  { target: "software", source: "portfolio" , strength: 0.8 },
  { target: "research", source: "portfolio" , strength: 0.8 },
  { target: "research", source: "optimal" , strength: 0.4 },
  { target: "games", source: "rocket" , strength: 0.4 },
  { target: "games", source: "evorite" , strength: 0.4 }

];

const simulation = d3.forceSimulation(nodes)
  .force('charge', d3.forceManyBody().strength(-3800)) 
  .force('center', d3.forceCenter(width / 2, height / 2))
  .force('link', d3.forceLink(links)
  .id(link => link.id)
  .strength(link => link.strength))
  .force('attract', attract()
    .target([width / 2, height / 2])
    .strength(function (d) { return 0.08; }));

const svg = d3.select('svg')
  .attr('width', width)
  .attr('height', height);

// adds connected nodes for decoration
function addDecorationNodes() {

}

function getNodeColor(node) {
    const levelColors = ["white", "cyan", "pink"];
    return levelColors[node.level-1];
}

function getNodeRadius(node) {
    const radii = [25, 35, 55];
    return radii[node.level-1];
}

function getFontSize(node) {
    const font = [14, 15, 16];
    return font[node.level-1];
}

const linkGraphics = svg.append('g')
    .attr("class", "link")
    .selectAll("line")
    .data(links)
    .enter().append("line")
      .attr("stroke-width", 1)
	  .attr("stroke", "white");

const nodeGraphics = svg.append('g')
    .selectAll('a')
    .data(nodes)
    .enter()
        .append("a")
        .attr("xlink:href", function(d){ return d.link; })
        .attr('target', '_blank"')
        .append('circle')
            .attr("class", "node")
            .attr('r', getNodeRadius)
            .attr('fill', getNodeColor);

    

const nodeLabels = svg.append('g')
  .selectAll('text')
  .data(nodes)
  .enter().append('text')
    .text(node => node.label)
    .attr('font-size', getFontSize)
    .attr('font-family', "'Trebuchet MS', Helvetica, sans-serif")
    .attr('text-anchor', 'middle')
    .attr('fill', '#030303') 
    .attr('class', 'text-label');

simulation.nodes(nodes).on('tick', () => {
    nodeGraphics
        .attr("cx", node => node.x)
        .attr("cy", node => node.y);
    nodeLabels
        .attr("x", node => node.x)
        .attr("y", node => node.y);
    linkGraphics
        .attr('x1', link => link.source.x)
        .attr('y1', link => link.source.y)
        .attr('x2', link => link.target.x)
        .attr('y2', link => link.target.y);
})

function mouseOver(node) {
    if(node.level > 1){
        d3.select(this).style("cursor", "pointer"); 
    }
    d3.select(this).transition()
      .duration(100)
      .attr("r", getNodeRadius(node) * 1.3);
}

svg.on('mousemove', function () {
    simulation.force('attract').target(d3.mouse(this));
    simulation
      .alphaTarget(0.3)
      .restart();
  });
  
function mouseOut(node) {
    d3.select(this).transition()
      .duration(200)
      .attr("r", getNodeRadius(node));
}

nodeGraphics
    .on('mouseover', mouseOver)
    .on('mouseout', mouseOut);



