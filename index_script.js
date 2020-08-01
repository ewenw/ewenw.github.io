const width = 1000;
const height = 900;

     
const nodes = [ 
  { id: "games", link: "", label: "Games", level: 1 },
  { id: "software", link: "", label: "Software", level: 1 },
  { id: "research", link: "", label: "Research", level: 1 },
  { id: "optimal", link: "OptimalDesign.pdf", label: "Optimal Design", level: 3, description: "Search algorithm for the optimal parameters of a simulated experiment"},
  { id: "rocket", link: "https://play.google.com/store/apps/details?id=com.ween.rocket&hl=en_US", label: "Land the Rocket", level:4 , description: "Land a SpaceX orbital booster on a drone ship in the middle of the ocean"},
  { id: "evorite", link: "https://play.google.com/store/apps/details?id=com.complex51.evorite", label: "Evorite", level: 2 , description: "Explore the solar system's mysteries through the adventure of a space probe"},
  { id: "swipe", link: "https://play.google.com/store/apps/details?id=com.weengames.smashballistics", label: "Swipe Ballistics", level: 2 , description: "Smash through obstacles and defend yourself by tossing projectiles"},
  { id: "prisoner", link: "https://github.com/ewenw/prisonersgame", label: "Prisoner's Dilemma", level: 3, description: "Prisoner's dilemma implementation for running live web experiments"},
  { id: "factory-tools", link: "https://github.com/ewenw/typeorm-factory-tools", label: "factory-tools", level: 3, description: "NPM package for writing transactional tests with TypeOrm"},
  { id: "hackdartmouth", link: "https://github.com/ewenw/YelpMyProfessors", label: "YelpMyProfessors", level: 3, description: "Sentiment analyzer that predicts ratings for comments and reviews"},
  { id: "nodegame", link: "https://nodegame.org", label: "nodeGame", level: 3, description: "JavaScript framework for running real-time behavioral science experiments"},
  { id: "hawkdove", link: "https://github.com/ewenw/HawkDove", label: "HawkDove", level: 3, description: "Online experiment to study innovation in dynamic networks"},
  { id: "scalacask", link: "https://github.com/ewenw/ScalaCask", label: "ScalaCask", level: 3, description: "Lightweight, high throughput key-value store based on BitCask"},
  { id: "authorml", link: "https://github.com/ewenw/AuthorML", label: "AuthorML", level: 3, description: "Classifying the classics - authorship identification through machine learning"}
  
];

const degreeOne = 3;
const degreeTwo = 1.9;
const nodeHeight = 40;

const links = [
  { target: "games", source: "software" , strength: degreeOne },
  { target: "software", source: "research" , strength: degreeOne },
  { target: "research", source: "games" , strength: degreeOne },
  { target: "games", source: "rocket" , strength: degreeTwo },
  { target: "games", source: "evorite" , strength: degreeTwo },
  { target: "games", source: "swipe" , strength: degreeTwo },
  { target: "software", source: "factory-tools" , strength: degreeTwo },
  { target: "software", source: "scalacask" , strength: degreeTwo },
  { target: "software", source: "hawkdove" , strength: degreeTwo },
  { target: "research", source: "optimal" , strength: degreeTwo },
  { target: "research", source: "prisoner" , strength: degreeTwo },
  { target: "research", source: "authorml" , strength: degreeTwo },
  { target: "nodegame", source: "software" , strength: degreeTwo },
  { target: "hackdartmouth", source: "software" , strength: degreeTwo }
  
];

const simulation = d3.forceSimulation(nodes)
  .velocityDecay(0.99)
  .force('charge', d3.forceManyBody().strength(-10000)) 
  .force('center', d3.forceCenter(width / 2, height / 2))
  .force('link', d3.forceLink(links)
  .id(link => link.id)
  .strength(link => link.strength))
  .force('attract', attract()
    .strength(function (d) { return 0.1; }));

const svg = d3.select('svg')
  .attr('width', width)
  .attr('height', height);

svg.style("opacity", 0.0)
  .transition()
  .duration(2500)
  .style("opacity", 1.0)

function getNodeColor(node) {
    const levelColors = ["#31485b", "#31485b", "#31485b", "#31485b"];
    return levelColors[node.level-1];
}

function getNodeSize(node) {
  if (node.level == 1)
    return 0;
  return node.label.length * 3 + 55;
}

function getFontSize(node) {
    const font = [24, 18, 18, 18, 18];
    return font[node.level]-node.label.length / 3;
}

const linkGraphics = svg.append('g')
    .attr("class", "link")
    .selectAll("line")
    .data(links)
    .enter().append("line")
      .attr("stroke-width", 0.4)
	    .attr("stroke", "white");

const nodeGraphics = svg.append('g')
    .selectAll('a')
    .data(nodes)
    .enter()
        .append("a")
        .append("rect")
        .attr("class", function(d) {return "node-"+d.id;})
        .attr("x", -getNodeSize/2)
        .attr("y", -nodeHeight/2)
        .attr("width", getNodeSize)
        .attr("height", nodeHeight)
        .attr("rx", 50)
        .attr("ry", 50)
        .attr('fill', getNodeColor);


const nodeLabels = svg.append('g')
  .selectAll('text')
  .data(nodes)
  .enter().append('text')
    .text(node => node.label)
    .attr('font-size', getFontSize)
    .attr('font-family', "'Trebuchet MS', Helvetica, sans-serif")
    .attr('text-anchor', 'middle')
    .attr('fill', 'white') 
    .attr('class', function(d){return 'text-label-'+d.id});

const nodeOverlay = svg.append('g')
    .selectAll('a')
    .data(nodes)
    .enter()
        .append("a")
        .attr("xlink:href", function(d){ return d.link === "" ? "#" : d.link; })
        .attr('target', function(d){ return d.link === "" ? "" : "_blank'"; })
        .append("rect")
        .attr("x", -getNodeSize/2)
        .attr("y", -nodeHeight/2)
        .attr("width", getNodeSize)
        .attr("height", nodeHeight)
        .attr("rx", 10)
        .attr("ry", 10)
        .attr('fill', 'transparent');

simulation.nodes(nodes).on('tick', () => {
    nodeGraphics
        .attr("x", function(d) { return d.x - getNodeSize(d)/2})
        .attr("y", function(d) { return d.y - nodeHeight/2 -5}) 
    nodeOverlay
        .attr("x", function(d) { return d.x - getNodeSize(d)/2})
        .attr("y", function(d) { return d.y - nodeHeight/2 -5})
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
  if(node.link !== "") {
      node.fx = d3.mouse.x;
      node.fy = d3.mouse.y;
      d3.select(this).style("cursor", "pointer"); 
      d3.selectAll(".node-"+node.id).transition()
        .duration(100)
        .attr("rx", "10px")
        .attr("ry", "10px")
        .attr("fill", "white");
      d3.selectAll("#description").html(node.description);
      d3.selectAll(".text-label-"+node.id).transition()
        .duration(100)
        .attr("fill", "black");
  }
}

svg.on('mousemove', function () {
    simulation.force('attract').target(d3.mouse(this));
    simulation
      .alphaTarget(0.3)
      .restart();
  });
  
function mouseOut(node) {
    simulation.restart();
    d3.selectAll(".node-"+node.id).transition()
      .duration(400)
      .attr("rx", "50px")
      .attr("ry", "50px")
      .attr("fill", getNodeColor);
    d3.selectAll(".text-label-"+node.id).transition()
      .duration(400)
      .attr("fill", "white");
}

nodeOverlay
    .on('mouseover', mouseOver)
    .on('mouseout', mouseOut);

svg.on('zoom', function () {
    this.attr("transform", "translate(" + d3.event.translate + ")" + " scale(" + d3.event.scale + ")");
});


