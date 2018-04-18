let attract = function (target) {
    let nodes, targets, strength, strengths;

    function force(alpha) {
        for (var i = 0; i < nodes.length; i++) {
            node = nodes[i];
            target = targets[i];
            strength = strengths[i];
            node.vx += (target[0] - node.x) * strength * alpha;
            node.vy += (target[1] - node.y) * strength * alpha;
        }
    }

    force.strength = function (v) {
        if (v == null) return strength;

        strength = typeof v === 'function' ? v : function () {
            return +v;
        };

        initialize();
        return force;
    };

    function initialize() {
        if (!nodes) return;

        strengths = new Array(nodes.length);
        for (var i = 0; i < nodes.length; i++) {
            strengths[i] = nodes[i].level/60;
        } 
        targets = new Array(nodes.length);
        for (var j = 0; j < nodes.length; j++) {
            targets[j] = target(nodes[j], j, nodes);
        }
    }

    force.initialize = function (n) {
        nodes = n;
        initialize();
    };

    

    force.target = function (v) {
        if (v == null) return target;

        target = typeof v === 'function' ? v : function () {
            return v;
    };

    initialize();
    return force;
    };

    force.strength(0.1);
    if (!target) force.target([0, 0]);

    return force;
};
