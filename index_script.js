const width = window.innerWidth * 0.75;
const height = window.innerHeight * 0.75;

     
const nodes = [ 
  { id: "portfolio", link: "", label: "", level: 1 },
  { id: "games", link: "", label: "Games", level: 2 },
  { id: "software", link: "", label: "Software", level: 2 },
  { id: "research", link: "", label: "Research", level: 2 },
  { id: "optimal", link: "https://github.com/ewenw/OptimalDesign", label: "Optimal Design", level: 3, description: "Selecting the best experiments through simulation models and a GP search algorithm"},
  { id: "rocket", link: "https://play.google.com/store/apps/details?id=com.ween.rocket&hl=en_US", label: "Land the Rocket", level:4 , description: "Experience the thrill of landing a reusable orbital booster on a drone ship in the middle of the ocean."},
  { id: "evorite", link: "https://play.google.com/store/apps/details?id=com.complex51.evorite", label: "Evorite", level: 4 , description: "Explore the mysteries of the solar system through breathtaking graphics"},
  { id: "swipe", link: "https://play.google.com/store/apps/details?id=com.weengames.smashballistics", label: "Swipe Ballistics", level: 4 , description: "Master ballistic physics and throw projectiles to get through obstacles"},
  { id: "prisoner", link: "https://github.com/ewenw/prisonersgame", label: "Prisoner's Dilemma", level:3, description: "Prisoner's dilemma implmementation for running live web experiments"},
  { id: "actions", link: "https://github.com/ewenw/actions", label: "Actions", level: 5, description: "Live macro keyboard and mouse recorder in Java"},
  { id: "hackdartmouth", link: "https://github.com/ewenw/YelpMyProfessors", label: "YelpMyProfessors", level: 5, description: "Tired of reading reviews? Just paste them in for an overall rating!"},
  { id: "nodegame", link: "https://nodegame.org", label: "nodeGame", level: 3, description: "Fast, scalable JavaScript for large-scale, online, multiplayer, real-time games and experiments"},
  { id: "hawkdove", link: "https://github.com/ewenw/HawkDove", label: "Hawk-Dove", level: 5, description: "Large-scale experiment for the study of innovation in dynamic networks"}
  
];

const links = [
  { target: "games", source: "portfolio" , strength: 1.5 },
  { target: "games", source: "rocket" , strength: 1 },
  { target: "games", source: "evorite" , strength: 1 },
  { target: "games", source: "swipe" , strength: 1 },
  { target: "software", source: "portfolio" , strength: 1.5 },
  { target: "software", source: "actions" , strength: 1 },
  { target: "software", source: "hawkdove" , strength: 1.5 },
  { target: "research", source: "portfolio" , strength: 1.5 },
  { target: "research", source: "optimal" , strength: 1.2 },
  { target: "optimal", source: "prisoner" , strength: 1.2 },
  { target: "nodegame", source: "prisoner" , strength: 1.2 },
  { target: "nodegame", source: "research" , strength: 1.2 },
  { target: "hackdartmouth", source: "software" , strength: 1.2 },
  { target: "evorite", source: "rocket" , strength: 1.2 },
  { target: "rocket", source: "swipe" , strength: 1.2 },
  
];

const simulation = d3.forceSimulation(nodes)
  .velocityDecay(0.92)
  .force('charge', d3.forceManyBody().strength(-4000)) 
  .force('center', d3.forceCenter(width / 2, height / 2))
  .force('link', d3.forceLink(links)
  .id(link => link.id)
  .strength(link => link.strength))
  .force('attract', attract()
    .target([width / 2, height / 2])
    .strength(function (d) { return 0.1; }));

const svg = d3.select('svg')
  .attr('width', width)
  .attr('height', height);
  
function getNodeColor(node) {
    const levelColors = ["white", "cyan", "purple", "orange", "teal", "green"];
    return levelColors[node.level-1];
}

function getNodeRadius(node) {
    const radii = [10, 5, 24, 18, 20, 15];
    return radii[node.level-1];
}

function getFontSize(node) {
    const font = [14, 15, 16, 14, 14, 14, 14];
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
        .attr("xlink:href", function(d){ return d.link === "" ? "#" : d.link; })
        .attr('target', function(d){ return d.link === "" ? "" : "_blank'"; })
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
    .attr('fill', '#FFFFFF') 
    .attr('class', 'text-label');

simulation.nodes(nodes).on('tick', () => {
    nodeGraphics
        .attr("cx", function(d) { return d.x = Math.max(20, Math.min(width - 20, d.x)); })
        .attr("cy", function(d) { return d.y = Math.max(40, Math.min(height - 20, d.y)); })
    nodeLabels
        .attr("x", node => node.x)
        .attr("y", node => node.y - 30);
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
        d3.select(this).transition()
        .duration(100)
        .attr("r", getNodeRadius(node) * 1.3);
        d3.selectAll(".description").html(node.description);
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
    d3.select(this).transition()
      .duration(200)
      .attr("r", getNodeRadius(node));
}

nodeGraphics
    .on('mouseover', mouseOver)
    .on('mouseout', mouseOut);

svg.on('zoom', function () {
    this.attr("transform", "translate(" + d3.event.translate + ")" + " scale(" + d3.event.scale + ")");
  });


