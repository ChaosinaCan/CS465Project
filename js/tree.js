$(function() {

	var currentHover = null;

	var margins = [20, 120, 20, 120];

	var height = window.innerHeight;
	var width = window.innerWidth;

	var i = 0;
	var z = 0;
	var dist = 400;

	var nodeHeight = 66;
	var nodeHeightExp = 90;
	var nodeWidth = 202;

	var nodeHeightZoom = 54;
	var nodeWidthZoom = 54;

	var tree = d3.layout.tree().size([height, width]);
	var heightMod = 1;

	var panBase = [((width - nodeWidth - dist) / 2), 0];
	var currentPan = [0, 0];

	var diagonal = d3.svg.diagonal()
		.projection(function(d) { return [d.y, d.x]; });

	var vis = d3.select("#vine").append("svg:svg")
		.attr("id", "test")
		.attr("height", "100%")
		.attr("width", "100%")
		.call(d3.behavior.zoom().on("zoom", pan))
		.on("dblclick.zoom", null)
		.on("mousewheel.zoom", changeLevel)
		.append("svg:g")
			.attr("transform", "translate(" + panBase + ")")
			.attr("id", "tree");

	function updateNode(err, node) {
		update(node);
	}

	function getNodeClip(d) {
		return 'url(#clip-' + d.id + ')';
	}

	window.update = function(source) {

		var duration = d3.event && d3.event.altKey ? 1000 : 250;

		//		checkOverlap(vine.rootnode);

		var nodes = tree.nodes(vine.rootnode).reverse();

		nodes.forEach(function(d) {
			if (z == 0) {
				d.y = d.depth * dist;
			} else {
				d.y = d.depth * 150;
			}

			d.lX = d.x + nodeHeight / 2;

			d.lStartYm = d.y + nodeWidth;
			d.lStartYz = d.y + nodeWidthZoom;

		});

		var node = vis.selectAll("g.node")
			.data(nodes, function(d) { return d.id || (d.id = ++i); });

		var nodeClip = node.enter().append('svg:clipPath')
			.attr('transform', 'translate(0, 0)')
			.attr('id', function(d) { return 'clip-' + d.id; })
			.append('svg:rect')
				.attr('width', nodeWidth)
				.attr('height', nodeHeight - 2)

		var nodeEnter = node.enter().append("svg:g")
			.attr("class", "node")
			.attr("transform", function(d) { return "translate(" + source.y0 + "," + source.x0 + ")"; })
			.on("click", nodeClick)
			.on("mouseover", nodeOver);

		nodeEnter.append("svg:rect")
			.attr("height", nodeHeight)
			.attr("width", nodeWidth)
			.attr("class", "nodeBG")
			.attr("rx", "3px")
			.attr("ry", "3px")
			.style("stoke", "black")
			.style("fill", "white");

		nodeEnter.append("svg:image")
			.attr("xlink:href", function(d) {
				return d.song.albumArt ? d.song.albumArt : "/cs465/img/no-album-black.svg";
			})
			.attr("width", "48px")
			.attr("height", "48px")
			.attr("x", "9px")
			.attr("y", "9px")
			.attr("class", "albumArt");

		nodeEnter.append("svg:text")
			.attr("x", "65px")
			.attr("y", "26px")
			.attr('width', '130px')
			.attr("class", "ellipsis name")
			.attr('clip-path', getNodeClip)
			.text(function(d) {
				return d.song.name || 'No Title';
				//var a = d.song.name;
				//return a.length > 12 ? a.slice(0, 12) + "..." : a;
			});

		nodeEnter.append("svg:text")
			.attr("x", "65px")
			.attr("y", "51px")
			.attr('width', '130px')
			.attr("class", "ellipsis artist")
			.attr('clip-path', getNodeClip)
			.text(function(d) {
				return d.song.artist || 'No Artist';
				//var a = d.song.artist;
				//return a.length > 12 ? a.slice(0, 12) + "..." : a;
			});

		nodeEnter.append("svg:text")
			.attr("text-anchor", "middle")
			.attr("x", "33px")
			.attr("y", "75px")
			.attr("width", "100px")
			.attr("class", "ellipsis zoomName")
			.text(function(d) {
				return d.song.name || 'No Title';
				//var a = d.song.name;
				//return a.length > 12 ? a.slice(0, 12) + "..." : a;
			})
			.style("opacity", 0.0);


		var controls = nodeEnter.append("svg:g")
			.attr("class", "nodeControls")
			.attr('clip-path', getNodeClip);

		controls.append("svg:rect")
			.attr("width", "64px")
			.attr("height", "0px")
			.attr("x", "1px")
			.attr("y", "65px")
			.style("opacity", 0.0)
			.on("click", playClick)
			.on("mousedown", playDown)
			.on("mouseup", playUp)
			.on("mouseover", playOver)
			.on("mouseout", playOut);


		controls.append("svg:rect")
			.attr("width", "64px")
			.attr("height", "0px")
			.attr("x", "65px")
			.attr("y", "65px")
			.style("opacity", 0.0)
			.on("click", queueClick)
			.on("mousedown", queueDown)
			.on("mouseup", queueUp)
			.on("mouseover", queueOver)
			.on("mouseout", queueOut);


		controls.append("svg:rect")
			.attr("width", "36px")
			.attr("height", "0px")
			.attr("x", "129px")
			.attr("y", "65px")
			.style("opacity", 0.0)
			.on("click", favClick)
			.on("mousedown", favDown)
			.on("mouseup", favUp)
			.on("mouseover", favOver)
			.on("mouseout", favOut);


		controls.append("svg:rect")
			.attr("width", "36px")
			.attr("height", "0px")
			.attr("x", "165px")
			.attr("y", "65px")
			.style("opacity", 0.0)
			.on("click", infoClick)
			.on("mousedown", infoDown)
			.on("mouseup", infoUp)
			.on("mouseover", infoOver)
			.on("mouseout", infoOut);

		controls.append("svg:image")
			.attr("xlink:href", "/cs465/img/buttons.svg")
			.attr("width", "200px")
			.attr("height", "0px")
			.attr("x", "1px")
			.attr("y", "65px")
			.attr("class", "buttonsOverlay")
			.attr("preserveAspectRatio", "xMidYMin slice")
			.attr("pointer-events", "none");

		controls.append("svg:image")
			.attr("xlink:href", "/cs465/img/buttons-faved.svg")
			.attr("width", "200px")
			.attr("height", "0px")
			.attr("x", "1px")
			.attr("y", "65px")
			.attr("class", "buttonsOverlayFaved")
			.attr("preserveAspectRatio", "xMidYMin slice")
			.attr("pointer-events", "none");


		var nodeUpdate = node.transition()
			.duration(duration)
			.attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; });

		//nodeUpdate.select("image.buttonsOverlay")
		//	.attr("xlink:href", function(d) {
		//		return d.favorited ? "/cs465/img/buttons-faved.svg" : "/cs465/img/buttons.svg";
		//	});

		nodeUpdate.select('image.buttonsOverlay')
			.style('opacity', function(d) {
				return d.favorited ? 0 : 1;
			});

		nodeUpdate.select('image.buttonsOverlayFaved')
			.style('opacity', function(d) {
				return d.favorited ? 1 : 0;
			});

		if (z == 0) {

			nodeUpdate.select("g.node")
				.style("opacity", 1.0);

			nodeUpdate.select("rect")
				.attr("height", function(d) { return d.expanded == 1 ? nodeHeightExp : nodeHeight; })
				.attr("width", nodeWidth)
				.style("stroke", function(d) {
					if (vine.player.isPlaying(d)) {
						return "green";
					}
					else if (vine.player.isQueued(d)) {
						return "purple";
					}
					else if (vine.player.isAutoQueued(d)) {
						return "#D9ABD9";
					}
					else if (vine.player.wasPlayed(d)) {
						return "blue";
					}
					else {
						return "black";
					}
				})
				.style("fill", function(d) {
					if (vine.player.isPlaying(d)) {
						return "#B7F7B7";
					}
					else if (vine.player.isQueued(d)) {
						return "#D9ABD9";
					}
					else if (vine.player.isAutoQueued(d)) {
						return "#f9cdf9";
					}
					else if (vine.player.wasPlayed(d)) {
						return "#A8A8FF";
					}
					else {
						return "white";
					}
				})
				.style("opacity", 1.0);

			nodeUpdate.select("rect.nodeBG")
				.attr("x", "0px")
				.attr("y", "0px");

			nodeUpdate.select("image.albumArt")
				.style("opacity", 1.0);

			nodeUpdate.select("text.name")
				.style("opacity", 1.0)
				.delay(50);

			nodeUpdate.select("text.artist")
				.style("opacity", 1.0)
				.delay(50);

			nodeUpdate.select("text.zoomName")
				.style("opacity", 0.0);

			nodeUpdate.filter(function(d) { return d.expanded == 1; }).selectAll("g.nodeControls").selectAll("rect")
				.attr("height", "24px")
				.style("fill", function(d) {
					if (vine.player.isPlaying(d)) {
						return "green";
					}
					else if (vine.player.isQueued(d)) {
						return "purple";
					}
					else if (vine.player.wasPlayed(d)) {
						return "blue";
					}
					else {
						return "#CCCCCC";
					}
				})
				.delay(duration)
				.duration(0);

			nodeUpdate.filter(function(d) { return d.expanded == 1; }).selectAll("g.nodeControls").select("image")
				.attr("height", "24px")
				.attr("width", "200px");

			nodeUpdate.filter(function(d) { return d.expanded == 0; }).selectAll("g.nodeControls").selectAll("rect")
				.attr("height", "0px");

			//nodeUpdate.filter(function(d) { return d.expanded == 0; }).selectAll("g.nodeControls").select("image")
			//	.attr("height", "0px");

			nodeUpdate.each(function(d) {
				var h = d.expanded ? nodeHeight + 24 : nodeHeight - 2;
				vis.select('#clip-' + d.id).select('rect').transition()
					.duration(duration)
					.attr('height', h);
			});

		}
		else {

			nodeUpdate.filter(function(d) {
				return !(vine.player.wasPlayed(d) || vine.player.isPlaying(d) || vine.player.isQueued(d) || vine.player.isAutoQueued(d));
			}).select("rect.nodeBG")
				.style("opacity", 0.2);

			nodeUpdate.filter(function(d) {
				return !(vine.player.wasPlayed(d) || vine.player.isPlaying(d) || vine.player.isQueued(d) || vine.player.isAutoQueued(d));
			}).select("image.albumArt")
				.style("opacity", 0.2);

			nodeUpdate.select("rect")
				.attr("width", nodeWidthZoom)
				.attr("height", nodeHeightZoom);

			nodeUpdate.select("text.name")
				.style("opacity", 0.0)
				.duration(100);

			nodeUpdate.select("text.artist")
				.style("opacity", 0.0)
				.duration(100);

			nodeUpdate.filter(function(d) {
				return (vine.player.wasPlayed(d) || vine.player.isPlaying(d) || vine.player.isQueued(d) || vine.player.isAutoQueued(d));
			}).select("text.zoomName")
				.style("opacity", 1.0);

			nodeUpdate.filter(function(d) { return d.expanded == 1; }).selectAll("g.nodeControls").selectAll("rect")
				.attr("height", "0px")
				.duration(0);

			nodeUpdate.filter(function(d) { return d.expanded == 1; }).selectAll("g.nodeControls").selectAll("image")
				.attr("height", "0px")
				.attr("width", "66px");

			nodeUpdate.each(function(d) {
				var h = nodeHeight - 2;
				vis.select('#clip-' + d.id).select('rect').transition()
					.duration(duration)
					.attr('height', h);
			});

			nodeUpdate.select("rect.nodeBG")
				.attr("x", "6px")
				.attr("y", "6px");

		}

		var nodeExit = node.exit().transition()
			.duration(duration)
			.attr("transform", function(d) { return "translate(" + source.y + "," + source.x + ")"; })
			.remove();

		nodeExit.select("rect")
			.attr("width", 0)
			.attr("height", 0);

		nodeExit.select("text").style("opacity", 0.0);


		var link = vis.selectAll("path.link")
			.data(tree.links(nodes), function(d) { return d.target.id; });

		link.enter().insert("svg:path", "g")
			.attr("class", "link")
			.attr("d", function(d) {
				var o = { x: source.x0, y: source.y0 };
				var a = diagonal({ source: o, target: o });
				return a;
			})
			.transition()
			.duration(duration)
			.attr("d", diagonal);

		var linkUpdate = link.transition()
			.duration(duration)
			.attr("d", function(d) {
				var s;
				if (z == 0) {
					s = { x: d.source.lX, y: d.source.lStartYm };
				} else {
					s = { x: d.source.lX, y: d.source.lStartYz };
				}
				var t = { x: d.target.lX, y: d.target.y };
				var a = diagonal({ source: s, target: t });
				return a;
			});

		if (z == 0) {
			linkUpdate.style("opacity", 1.0);
		}
		else {
			linkUpdate.filter(function(d) {
				return !(vine.player.wasPlayed(d.target) || vine.player.isPlaying(d.target) || vine.player.isQueued(d.target) || vine.player.isAutoQueued(d.target));
			})
			.style("opacity", 0.2);
		}

		link.exit().transition()
			.duration(duration)
			.attr("d", function(d) {
				var o = { x: source.x, y: source.y };
				return diagonal({ source: o, target: o });
			})
			.remove();

		nodes.forEach(function(d) {
			d.x0 = d.x;
			d.y0 = d.y;
		});

	};

	function pan() {
		currentPan = d3.event.translate;
		vis.attr("transform", "translate(" + (d3.event.translate[0] + panBase[0]) + ", " + (d3.event.translate[1] + panBase[1]) + ")");
		//		console.log(d3.event.translate);
		update(vine.rootnode);
	}

	window.checkOverlap = function(node) {
		o = calcOverlap(node);
		scale(o);
	};

	function calcOverlap(node) {
		var maxOverlap = 0;
		var c = node.children;

		for (var i = 0; i < (c.length - 1) ; i++) {
			maxOverlap = Math.max(maxOverlap, 100 - (c[i + 1].x - c[i].x));
		}

		for (var i = 0; i < c.length; i++) {
			maxOverlap = Math.max(maxOverlap, calcOverlap(c[i]));
		}

		return maxOverlap;
	}

	function scale(overlap) {
		var old = height * heightMod;
		heightMod *= 100 / (100 - overlap);
		tree = d3.layout.tree().size([height * heightMod, width]);
		panBase[1] -= ((height * heightMod) - old) / 2;
		vis.transition()
			.duration(250)
			.attr("transform", "translate(" + (currentPan[0] + panBase[0]) + ", " + (currentPan[1] + panBase[1]) + ")");
		update(vine.rootnode);
	}

	function changeLevel(e) {
		z = d3.event.wheelDelta < 0 ? 1 : 0;
		update(vine.rootnode);
	}


	function nodeClick(d) {
		//d.expand(updateNode);
	}

	function nodeOver(d) {
		if (!z) {
			if (currentHover != null) {
				currentHover.expanded = 0;
			}
			d.expanded = 1;
			currentHover = d;
			update(vine.rootnode);
		}
	}

	function move(x, y) {
		var a = [x, y];
		vis.attr("transform", "translate(" + a + ")");
		update(vine.rootnode);
	}




	function playClick(d) {
		d3.event.stopPropagation();
		vine.player.playNow(d);
	}

	function playDown(d) {
		d3.event.stopPropagation();
		$(this).css("opacity", 1.0);
	}

	function playUp(d) {
		d3.event.stopPropagation();
		$(this).css("opacity", 0.5);
	}

	function playOver(d, a, b, c) {
		d3.event.stopPropagation();
		$(this).css("opacity", 0.5);
	}

	function playOut(d) {
		d3.event.stopPropagation();
		console.log("off play");
		$(this).css("opacity", 0.0);
	}



	function queueClick(d) {
		d3.event.stopPropagation();
		if (vine.player.isQueued(d)) {
			vine.player.dequeue(d);
		} else {
			vine.player.enqueue(d);
		}
	}

	function queueDown(d) {
		d3.event.stopPropagation();
		$(this).css("opacity", 1.0);
	}

	function queueUp(d) {
		d3.event.stopPropagation();
		$(this).css("opacity", 0.5);
	}

	function queueOver(d) {
		d3.event.stopPropagation();
		$(this).css("opacity", 0.5);
	}

	function queueOut(d) {
		d3.event.stopPropagation();
		$(this).css("opacity", 0.0);
	}




	function favClick(d) {
		d3.event.stopPropagation();
		if (d.favorited) {
			d.favorited = false;
			//			$(this).parent().children("image").attr("href", "/cs465/img/buttons.svg");
		}
		else {
			d.favorited = true;
			//			$(this).parent().children("image").attr("href", "/cs465/img/buttons-faved.svg");
		}

		if (vine.player.isPlaying(d)) {
			vine.player.updateSongInfo();
		}
		//		d.favorited = true;
		//		console.log($(this).parent().children("image"));
	}

	function favDown(d) {
		d3.event.stopPropagation();
		$(this).css("opacity", 1.0);
	}

	function favUp(d) {
		d3.event.stopPropagation();
		$(this).css("opacity", 0.5);
	}

	function favOver(d) {
		d3.event.stopPropagation();
		$(this).css("opacity", 0.5);
	}

	function favOut(d) {
		d3.event.stopPropagation();
		$(this).css("opacity", 0.0);
	}




	function infoClick(d) {
		d3.event.stopPropagation();
		console.log("clicked info");
		var url = d.song.url || d.song.albumUrl || d.song.artistUrl;
		if (url) {
			window.open(url);
		}
	}

	function infoDown(d) {
		d3.event.stopPropagation();
		$(this).css("opacity", 1.0);
	}

	function infoUp(d) {
		d3.event.stopPropagation();
		$(this).css("opacity", 0.5);
	}

	function infoOver(d) {
		d3.event.stopPropagation();
		$(this).css("opacity", 0.5);
	}

	function infoOut(d) {
		d3.event.stopPropagation();
		$(this).css("opacity", 0.0);
	}



	function toggle(d) {
		if (d.children) {
			d._children = d.children;
			d.children = null;
		} else {
			d.children = d._children;
			d._children = null;
		}
	}

});