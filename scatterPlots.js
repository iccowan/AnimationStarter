// Gets the mean grade from a given set of entries
var getMeanGrade = function(entries) {
    return d3.mean(entries,function(entry) {
            return entry.grade;
        })
}

// Draws the scatter plot
var drawScatter = function(students,target,
              xScale,yScale,xProp,yProp) {
    // Sets the banner title for the graph
    setBanner(xProp.toUpperCase() +" vs "+ yProp.toUpperCase());
    
    // Draws the points on the scatter plot
    d3.select(target).select(".graph")
        .selectAll("circle")
        .data(students)
        .enter()
        .append("circle")
        .attr("cx",function(student) {
            return xScale(getMeanGrade(student[xProp]));    
        })
        .attr("cy",function(student) {
            return yScale(getMeanGrade(student[yProp]));    
        })
        .attr("r",4)
        .on("mouseover",function(student)
        {   
            // tooltip
            var xPosition = parseFloat(d3.select(target).attr("cx")) + 10;
            var yPosition = parseFloat(d3.select(target).attr("cy")) + 10;
        
            d3.select("#tooltip")
                .style("left", xPosition + "px")
                .style("top", yPosition + "px")
                .select("#pengImg")
                    .attr("src", "imgs/" + student.picture);
        
            d3.select("#tooltip").select("#xdata")
                .text("Mean Quiz: " + Math.round(getMeanGrade(student.quizes)));
        
            d3.select("#tooltip #finalScore")
                .text("Final Score: " + student.final[0].grade);
        
            d3.select("#tooltip #avgHW")
                .text("HW Average: " + Math.round(getMeanGrade(student.homework)));
        
            d3.select("#tooltip #avgQuiz")
                .text("Quiz Average: " + Math.round(getMeanGrade(student.quizes)));
        
            d3.select("#tooltip #avgTest")
                .text("Test Average: " + Math.round(getMeanGrade(student.test)));
        
            d3.select("#tooltip").classed("hidden", false);
        })
        .on("mouseout",function(student)
           {
            d3.selectAll(".line")
                .classed("fade",false)
                .attr("stroke", "black");
            d3.selectAll(".point").remove();
            d3.selectAll(".point-text").remove();
            
            // tooltip
            d3.select("#tooltip").classed("hidden", true);
        });
}

// Clears the scatter plot
var clearScatter = function(target) {
    // Select and remove the points on the graph
    d3.select(target)
        .select(".graph")
        .selectAll("circle")
        .remove();
}

// Creates the axes on the graph
var createAxes = function(screen,margins,graph,
                           target,xScale,yScale) {
    // Setup axes
    var xAxis = d3.axisBottom(xScale);
    var yAxis = d3.axisLeft(yScale);
    
    // Draw the axes
    var axes = d3.select(target)
        .append("g")
    axes.append("g")
        .attr("transform","translate("+margins.left+","
             +(margins.top+graph.height)+")")
        .call(xAxis)
        .classed("axis", true)
    axes.append("g")
        .attr("transform","translate("+margins.left+","
             +(margins.top)+")")
        .call(yAxis)
        .classed("axis", true)
}

var setAxesTitles = function(screen, margins, graph, target, xTitle, yTitle) {
    var labels = d3.select(target)
                   .append("g")
                   .classed("labels", true);
    
    labels.append("text")
        .text(xTitle)
        .classed("label", true)
        .attr("text-anchor", "middle")
        .attr("x", margins.left + (graph.width / 2))
        .attr("y", graph.height + margins.bottom + 7);
    
    labels.append("g")
        .attr("transform","translate(20," + 
              (margins.top + (graph.height / 2)) + ")")
        .append("text")
        .text(yTitle)
        .classed("label", true)
        .attr("text-anchor", "middle")
        .attr("transform", "rotate(-90)")
}

var clearAxes = function(target) {
    // Select and remove the points on the graph
    d3.select(target)
        .selectAll(".axis")
        .remove();
    
    d3.select(target)
        .selectAll(".labels")
        .remove();
}

// Initialize the graph
var initGraph = function(target,students) {
    //the size of the screen
    var screen = {width:500, height:400};
    
    //how much space will be on each side of the graph
    var margins = {top:15,bottom:40,left:70,right:15};
    
    //generated how much space the graph will take up
    var graph = {
        width:screen.width-margins.left-margins.right,
        height:screen.height-margins.top-margins.bottom,
    }
    
    //set the screen size
    d3.select(target)
        .attr("width",screen.width)
        .attr("height",screen.height)
    
    //create a group for the graph
    var g = d3.select(target)
        .append("g")
        .classed("graph",true)
        .attr("transform","translate("+margins.left+","+
             margins.top+")");
        
    //create scales for all of the dimensions
    var xScale = d3.scaleLinear()
        .domain([0,100])
        .range([0,graph.width])
           
    var yScale = d3.scaleLinear()
        .domain([0,100])
        .range([graph.height,0])
  
    createAxes(screen,margins,graph,target,xScale,yScale);
    initButtons(students,target,xScale,yScale,graph,margins);
    setBanner("Click the Appropriate Button to Graph");
}

// Initialize the buttons
var initButtons = function(students,target,xScale,yScale,graph,margins) {
    // Draw the final vs. homework on click
    d3.select("#fvh")
    .on("click",function() {
        clearScatter(target);
        
        // Setup the scales for the appropriate data
        xScale = d3.scaleLinear()
            .domain([0, 100])
            .range([0, graph.width])
           
        yScale = d3.scaleLinear()
            .domain([0, 50])
            .range([graph.height, 0])
    
        // Clear and redraw the axes for the data
        clearAxes(target);
        createAxes(screen,margins,graph,target,xScale,yScale);
        setAxesTitles(screen, margins, graph, target, "Final", "Homework");
        
        // Draw the scatter plot
        drawScatter(students,target,
              xScale,yScale,"final","homework");
    })
    
    // Draw the final vs. quiz on click
    d3.select("#hvq")
    .on("click",function() {
        clearScatter(target);
        
        // Setup the scales for the appropriate data
        xScale = d3.scaleLinear()
            .domain([0, 50])
            .range([0, graph.width])
           
        yScale = d3.scaleLinear()
            .domain([0, 10])
            .range([graph.height, 0])
    
        // Clear and redraw the axes for the data
        clearAxes(target);
        createAxes(screen,margins,graph,target,xScale,yScale);
        setAxesTitles(screen, margins, graph, target, "Homework", "Quiz");
        
        drawScatter(students,target,
              xScale,yScale,"homework","quizes");
    })
    
    // Draw the test vs final on click
    d3.select("#tvf")
    .on("click",function() {
        clearScatter(target);
        
        // Setup the scales for the appropriate data
        xScale = d3.scaleLinear()
            .domain([0, 100])
            .range([0, graph.width])
           
        yScale = d3.scaleLinear()
            .domain([0, 100])
            .range([graph.height, 0])
    
        // Clear and redraw the axes for the data
        clearAxes(target);
        createAxes(screen,margins,graph,target,xScale,yScale);
        setAxesTitles(screen, margins, graph, target, "Test", "Final");
        
        drawScatter(students,target,
              xScale,yScale,"test","final");
    })
    
    // Draw the test vs quiz on click
    d3.select("#tvq")
    .on("click",function() {
        clearScatter(target);
        
        // Setup the scales for the appropriate data
        xScale = d3.scaleLinear()
            .domain([0, 100])
            .range([0, graph.width])
           
        yScale = d3.scaleLinear()
            .domain([0, 10])
            .range([graph.height, 0])
    
        // Clear and redraw the axes for the data
        clearAxes(target);
        createAxes(screen,margins,graph,target,xScale,yScale);
        setAxesTitles(screen, margins, graph, target, "Test", "Quiz");
        
        drawScatter(students,target,
              xScale,yScale,"test","quizes");
    }) 
}

// Sets the banner title
var setBanner = function(msg) {
    d3.select("#banner")
        .text(msg);
}

// Get the penguin data and begin the program
var penguinPromise = d3.json("classData.json");
penguinPromise.then(function(penguins) {
    console.log("class data",penguins);
    initGraph("#scatter",penguins);
}, function(err) {
   console.log("Error Loading data:",err);
});