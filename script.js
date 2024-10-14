// Lista de nodos y rutas entre las ciudades
const nodes = ["Lima", "Ica", "Cuzco", "Juliaca", "Nazca", "Arequipa", "Moquegua", "Puno", "Tacna"];

const edges = [
    // Conexiones desde Lima
    { fromNode: "Lima", toNode: "Ica", distance: 305, time: 5, cost: 40 },
    { fromNode: "Lima", toNode: "Cuzco", distance: 1400, time: 20, cost: 130 },

    // Conexiones desde Ica
    { fromNode: "Ica", toNode: "Cuzco", distance: 850, time: 16, cost: 100 },
    { fromNode: "Ica", toNode: "Nazca", distance: 145, time: 2, cost: 20 },


    // Conexiones desde Nazca
    { fromNode: "Nazca", toNode: "Cuzco", distance: 660, time: 14, cost: 100 },
    { fromNode: "Nazca", toNode: "Arequipa", distance: 570, time: 10, cost: 80 },

    // Conexiones desde Cuzco
    { fromNode: "Cuzco", toNode: "Juliaca", distance: 320, time: 6, cost: 35 },
    { fromNode: "Cuzco", toNode: "Arequipa", distance: 850, time: 16, cost: 100 },

    // Conexiones desde Arequipa
    { fromNode: "Arequipa", toNode: "Juliaca", distance: 280, time: 6, cost: 30 },
    { fromNode: "Arequipa", toNode: "Puno", distance: 300, time: 7, cost: 50 },
    { fromNode: "Arequipa", toNode: "Moquegua", distance: 230, time: 5, cost: 50 },
    { fromNode: "Arequipa", toNode: "Tacna", distance: 380, time: 7, cost: 60 },

    // Conexiones desde Juliaca
    { fromNode: "Juliaca", toNode: "Puno", distance: 45, time: 1.5, cost: 20 },
    { fromNode: "Juliaca", toNode: "Tacna", distance: 300, time: 7, cost: 50 },

    // Conexiones desde Puno
    { fromNode: "Puno", toNode: "Tacna", distance: 320, time: 7, cost: 50 },

    // Conexiones desde Moquegua
    { fromNode: "Moquegua", toNode: "Tacna", distance: 160, time: 3, cost: 15 }
];

window.onload = function () {
    initializeGraph(); // Dibuja el gráfico base sin rutas resaltadas
};

function initializeGraph() {
    drawGraph(); // Llama a drawGraph con un arreglo vacío para mostrar el gráfico inicial
}

function resetGraph() {
    // Obtener el contenedor del gráfico
    let graphContainer = document.getElementById("graph");
    graphContainer.innerHTML = ''; // Limpiar el contenedor completamente

    // Redibujar el gráfico base con los nodos y las conexiones originales
    drawGraph([]); // Llamar a la función de dibujo con un array vacío para restablecer

    // Restablecer el área de resultado
    document.getElementById('routeOutput').innerHTML = "Gráfico restablecido a su estado inicial.";
    
    console.log("Gráfico restablecido a su estado inicial.");
}



function drawGraph(routeNodes = []) {
    let graphContainer = document.getElementById("graph");
    graphContainer.innerHTML = ''; // Limpiar el contenedor antes de dibujar el nuevo gráfico

    // Determinar si es una pantalla pequeña para ajustar dimensiones
    let isSmallScreen = window.innerWidth <= 768;

    // Definir tamaños y proporciones basados en la pantalla
    let svgWidth = isSmallScreen ? 400 : 650; // Ajustar el ancho
    let svgHeight = isSmallScreen ? 400 : 530; // Ajustar la altura
    let circleRadius = isSmallScreen ? 15 : 18; // Ajustar el tamaño de los nodos
    let textOffsetX = isSmallScreen ? -7 : -10; // Ajustar la posición del texto
    let textOffsetY = isSmallScreen ? 3 : 5;

    // Definir SVG con las nuevas dimensiones
    let svg = `<svg height="${svgHeight}px" width="${svgWidth}px">`;

    // Dibujar aristas con estilo según si forman parte de la ruta o no
    edges.forEach(edge => {
        let fromPos = getNodePos(edge.fromNode.trim(), isSmallScreen);
        let toPos = getNodePos(edge.toNode.trim(), isSmallScreen);

        // Verificar si la arista conecta nodos contiguos en la ruta
        let isRouteEdge = routeNodes.includes(edge.fromNode.trim()) && routeNodes.includes(edge.toNode.trim()) &&
                          Math.abs(routeNodes.indexOf(edge.fromNode.trim()) - routeNodes.indexOf(edge.toNode.trim())) === 1;

        let lineStyle = isRouteEdge ? 'stroke: #00b300; stroke-width: 4' : 'stroke: grey; stroke-width: 2';
        let labelColor = isRouteEdge ? '#00b300' : 'black';

        // Dibuja la línea con estilo
        svg += `<line x1="${fromPos.x}" y1="${fromPos.y}" x2="${toPos.x}" y2="${toPos.y}" style="${lineStyle}" />`;

        // Dibuja la etiqueta de distancia y costo en dos líneas de texto separadas
        let midX = (fromPos.x + toPos.x) / 2;
        let midY = (fromPos.y + toPos.y) / 2;


         // Etiqueta de distancia en negrita y con un poco más de margen
         svg += `<text x="${midX}" y="${midY - 2}" fill="${labelColor}" text-anchor="middle" font-weight="bold" font-size="13px">${edge.distance} km</text>`;

         // Superponer etiqueta de costo con la misma posición (negrita)
         svg += `<text x="${midX}" y="${midY + 10}" fill="${labelColor}" text-anchor="middle" font-weight="bold" font-size="13px">S/ ${edge.cost}</text>`;
    });


    // Dibujar nodos con color y estilo diferenciados si forman parte de la ruta
    nodes.forEach(node => {
        let pos = getNodePos(node.trim(), isSmallScreen);
        let fillColor = routeNodes.includes(node.trim()) ? '#00b300' : 'red';
        
        // Controlar el tamaño del texto y agregar contorno
        let textSize = isSmallScreen ? '9px' : '13px';
        
        // Texto de contorno
        svg += `<circle cx="${pos.x}" cy="${pos.y}" r="${circleRadius}" fill="${fillColor}" />` +
            `<text x="${pos.x}" y="${pos.y + textOffsetY}" fill="none" stroke="black" stroke-width="2" text-anchor="middle" font-weight="bold" font-size="${textSize}">${node.trim()}</text>` +
            // Texto principal superpuesto
            `<text x="${pos.x}" y="${pos.y + textOffsetY}" fill="white" text-anchor="middle" font-weight="bold" font-size="${textSize}">${node.trim()}</text>`;
    });


    svg += '</svg>';
    graphContainer.innerHTML = svg;
}


function calculateRoute() {
    const fromNode = document.getElementById("fromNode").value;
    const toNode = document.getElementById("toNode").value;
    const algorithm = document.getElementById("algorithm").value;

    // Si el algoritmo, el nodo de inicio o el nodo de destino no están definidos, no calcular.
    if (!algorithm || !fromNode || !toNode) {
        console.log("Por favor, seleccione nodos válidos y un algoritmo.");
        return;
    }

    // Limpiar el contenedor de resultados y gráficos antes de recalcular
    console.clear(); 
    document.getElementById('routeOutput').innerHTML = "";
    let graphContainer = document.getElementById("graph");
    graphContainer.innerHTML = ''; 


    resetComparisonTable(); // Limpiar la tabla de comparativa antes de recalcular

    let result = "";
    let pathNodes = []; // Reiniciar variables

    console.log("Algoritmo seleccionado:", algorithm);
    console.log("Nodo de inicio:", fromNode);
    console.log("Nodo de destino:", toNode);

    // Seleccionar y calcular el algoritmo correspondiente
    switch (algorithm) {
        case 'greedy-cost':
            result = calculateGreedyCost(fromNode, toNode);
            pathNodes = extractPathNodesGreedyCost(result);
            break;
        case 'greedy-distance':
            result = calculateGreedyDistance(fromNode, toNode);
            pathNodes = extractPathNodesGreedyDistance(result);
            break;
        case 'greedy-time':
            result = calculateGreedyTime(fromNode, toNode);
            pathNodes = extractPathNodesGreedyTime(result);
            break;
        case 'a-star':
            result = calculateAStar(fromNode, toNode);
            pathNodes = extractPathNodesAStar(result);
            break;
        case 'dijkstra':
            result = calculateDijkstra(fromNode, toNode);
            pathNodes = extractPathNodesDijkstra(result);
            break;
        case 'dumb':
            result = calculateDumbRoute(fromNode, toNode);
            pathNodes = extractPathNodesDumb(result);
            break;
        default:
            result = "Seleccione un algoritmo válido.";
    }

    console.log("Resultado del algoritmo:", result);
    console.log("Nodos extraídos para la visualización:", pathNodes);

    // Asegurarse de que solo se dibuje el gráfico si hay nodos válidos
    if (pathNodes.length > 0) {
        drawGraph(pathNodes); // Dibuja la ruta con el nuevo resultado si hay nodos válidos
    } else {
        console.log("No hay nodos válidos para mostrar, no se dibuja la ruta.");
        drawGraph([]); // Dibuja el gráfico base sin ninguna ruta
    }

    // Mostrar el resultado en el área de salida
    document.getElementById('routeOutput').innerHTML = result;
}


function reconstructPath(cameFrom, current) {
    let totalPath = [current];
    while (cameFrom[current]) {
        current = cameFrom[current];
        totalPath.unshift(current);
    }
    return totalPath; // Asegúrate de que retorne un array
}

function calculateDijkstra(startNode, goalNode, criterion = 'cost') {
    let distances = {};
    let prev = {};
    let pq = new PriorityQueue();
    let path = [];

    // Inicializar las distancias y el predecesor para cada nodo
    nodes.forEach(node => {
        distances[node] = Infinity;
        prev[node] = null;
    });

    distances[startNode] = 0;
    pq.enqueue(startNode, 0);

    resetComparisonTable(); // Limpiar la tabla antes de comenzar

    while (!pq.isEmpty()) {
        let currentNode = pq.dequeue().element;

        // Si llegamos al nodo objetivo, reconstruir el camino
        if (currentNode === goalNode) {
            while (prev[currentNode]) {
                path.unshift(currentNode);
                currentNode = prev[currentNode];
            }
            path.unshift(startNode);

            return `Ruta Dijkstra: ${path.join(' → ')} (Costo total: S/ ${distances[goalNode]})`;
        }

        // Evaluar los vecinos del nodo actual
        edges.filter(edge => edge.fromNode === currentNode).forEach(edge => {
            let alt = distances[currentNode] + edge[criterion]; // Calcular la distancia alternativa usando el criterio seleccionado

            if (alt < distances[edge.toNode]) {
                // Si encontramos un camino más corto, actualizamos los valores
                updateComparisonTable(
                    currentNode,
                    edge.toNode,
                    `Distancia acumulada = ${distances[currentNode]}<br>Nueva distancia = ${alt}`,
                    "Seleccionado (Mejor camino)"
                );

                distances[edge.toNode] = alt;
                prev[edge.toNode] = currentNode;
                pq.enqueue(edge.toNode, alt);
            } else {
                // Si no es un mejor camino, añadirlo a la tabla con el motivo de descarte
                updateComparisonTable(
                    currentNode,
                    edge.toNode,
                    `Distancia acumulada = ${distances[currentNode]}<br>Nueva distancia = ${alt}`,
                    "Descarte (Camino subóptimo)"
                );
            }
        });
    }

    return "No se encontró una ruta válida.";
}


// Modificar las posiciones de los nodos según el tamaño de pantalla
function getNodePos(node, isSmallScreen = false) {
    const positions = {
        Lima: { x: 100, y: 90 },
        Ica: { x: 170, y: 200 },
        Cuzco: { x: 430, y: 180 },
        Nazca: { x: 230, y: 290 },
        Juliaca: { x: 580, y: 300 },
        Arequipa: { x: 400, y: 370 },
        Moquegua: { x: 470, y: 470 },
        Puno: { x: 530, y: 370 },
        Tacna: { x: 560, y: 500 }
    };

    let pos = positions[node] || { x: 0, y: 0 };

    // Ajustar posiciones para pantallas pequeñas
    if (isSmallScreen) {
        pos = { x: pos.x * 0.6, y: pos.y * 0.6 }; // Reducir las coordenadas en pantallas pequeñas
    }
    return pos;
}
// Adaptar el gráfico cuando la ventana cambie de tamaño
window.addEventListener('resize', () => {
    // Obtener la última ruta visualizada y redibujar con el nuevo tamaño
    const result = document.getElementById('routeOutput').innerHTML;
    const pathNodes = extractPathNodes(result);
    drawGraph(pathNodes);
});

// Implementación de una Cola de Prioridad
class PriorityQueue {
    constructor() {
        this.items = [];
    }

    enqueue(element, priority) {
        let queueElement = { element, priority };
        let added = false;

        for (let i = 0; i < this.items.length; i++) {
            if (queueElement.priority < this.items[i].priority) {
                this.items.splice(i, 0, queueElement);
                added = true;
                break;
            }
        }

        if (!added) {
            this.items.push(queueElement);
        }
    }

    dequeue() {
        return this.items.shift();
    }

    isEmpty() {
        return this.items.length === 0;
    }
}




// Algoritmo Tonto (selección aleatoria)
function calculateDumbRoute(startNode, goalNode) {
    let currentNode = startNode;
    let path = [currentNode]; // Almacena la ruta recorrida hasta ahora
    let visitedNodes = new Set(); // Nodos ya visitados para evitar ciclos
    let attempts = 0; // Contador de intentos para evitar bucles
    const maxAttempts = nodes.length * 3; // Definir un máximo de intentos para evitar bucles infinitos

    resetComparisonTable(); // Limpiar la tabla comparativa antes de empezar

    // Mientras no se llegue al nodo objetivo
    while (currentNode !== goalNode) {
        visitedNodes.add(currentNode); // Añadir el nodo actual a los visitados

        // Obtener vecinos disponibles que no hayan sido visitados ni formen ciclos
        let neighbors = edges.filter(e => e.fromNode === currentNode && !visitedNodes.has(e.toNode));

        // Si no hay vecinos disponibles y no se ha alcanzado el objetivo
        if (neighbors.length === 0) {
            // Si se excede el número máximo de intentos, salir
            if (attempts > maxAttempts) {
                console.log("Se ha alcanzado el número máximo de intentos.");
                return "No se encontró una ruta válida.";
            }

            // Aplicar backtracking: volver al nodo anterior y probar otro camino
            path.pop();
            if (path.length === 0) return "No se encontró una ruta válida."; // Si no hay más nodos en la ruta, terminar

            let backNode = currentNode; // Guardar el nodo antes de retroceder para la tabla
            currentNode = path[path.length - 1]; // Retroceder al nodo anterior
            console.log(`Backtracking a ${currentNode}. Ruta hasta ahora: ${path.join(" → ")}`);

            // Mostrar backtracking en la tabla
            updateComparisonTable(backNode, "Sin vecinos válidos", "-", "Backtracking a " + currentNode);

            attempts++; // Incrementar intentos
            continue; // Probar con otro vecino
        }

        // Selección aleatoria de un vecino
        let nextEdge = neighbors[Math.floor(Math.random() * neighbors.length)];
        
        // Actualizar la tabla comparativa con la elección aleatoria
        updateComparisonTable(currentNode, nextEdge.toNode, "-", "Seleccionado aleatoriamente");

        path.push(nextEdge.toNode); // Añadir el nodo siguiente a la ruta
        currentNode = nextEdge.toNode; // Actualizar el nodo actual

        // Mostrar progreso del algoritmo en la consola
        console.log(`Nodo actual: ${currentNode}, camino hasta ahora: ${path.join(" → ")}`);

        attempts++; // Incrementar el contador de intentos
    }

    const result = `Ruta Tonta: ${path.join(' → ')} (Total nodos: ${path.length})`;
    console.log("Resultado del algoritmo Dumb:", result); // Verificar el resultado

    // Mostrar el resultado final en la tabla
    updateComparisonTable(currentNode, "-", "-", "Ruta completada con éxito");

    return result;
}




// Función para actualizar la tabla comparativa
function updateComparisonTable(currentNode, neighborNode, metricValue, reason) {
    let tableContainer = document.getElementById("comparisonTableContainer");
    let tableBody = document.getElementById("comparisonTable").querySelector("tbody");

    // Mostrar el contenedor de la tabla
    tableContainer.style.display = "block";

    // Crear una nueva fila
    let newRow = document.createElement("tr");
    newRow.innerHTML = `
        <td>${currentNode}</td>
        <td>${neighborNode}</td>
        <td>${metricValue}</td>
        <td>${reason}</td>
    `;

    // Añadir la nueva fila al cuerpo de la tabla
    tableBody.appendChild(newRow);
}

// Función para limpiar la tabla comparativa antes de cada nueva ejecución
function resetComparisonTable() {
    let tableBody = document.getElementById("comparisonTable").querySelector("tbody");
    tableBody.innerHTML = ""; // Vaciar las filas
    document.getElementById("comparisonTableContainer").style.display = "none"; // Ocultar la tabla por defecto
}

// Función de cálculo Greedy para el costo con tabla comparativa
function calculateGreedyCost(startNode, goalNode) {
    let currentNode = startNode;
    let path = [currentNode];
    let totalCost = 0;

    while (currentNode !== goalNode) {
        // Encuentra todos los nodos vecinos del nodo actual
        let nextEdges = edges.filter(e => e.fromNode === currentNode && !path.includes(e.toNode));

        // Verificar si el destino está entre los nodos vecinos
        let directEdgeToGoal = nextEdges.find(e => e.toNode === goalNode);

        // Si encontramos una conexión directa al destino, forzar la selección
        if (directEdgeToGoal) {
            path.push(goalNode);
            totalCost += directEdgeToGoal.cost;
            console.log(`Forzando conexión directa a destino: ${goalNode}`);
            
            // Actualizar la tabla con la decisión de selección
            updateComparisonTable(currentNode, goalNode, `S/ ${directEdgeToGoal.cost}`, "Seleccionado (Conexión directa)");
            
            return `Ruta Avara (Costo): ${path.join(' → ')} (Costo total: S/ ${totalCost})`;
        }

        // Ordenar nodos por costo de menor a mayor
        nextEdges = nextEdges.sort((a, b) => a.cost - b.cost);

        // Evaluar cada nodo vecino y registrar la razón de descarte en la tabla
        nextEdges.forEach((edge, index) => {
            let reason = (index === 0) ? "Seleccionado (Menor costo)" : "Descarte (Mayor costo)";
            updateComparisonTable(currentNode, edge.toNode, `S/ ${edge.cost}`, reason);
        });

        let nextEdge = nextEdges[0]; // Seleccionar el de menor costo

        // Si no se encontró ninguna conexión válida, retornar error
        if (!nextEdge) {
            console.log(`No se encontró una ruta válida a partir de ${currentNode}.`);
            return "No se encontró una ruta válida.";
        }

        // Añadir el nodo seleccionado al camino
        path.push(nextEdge.toNode);
        totalCost += nextEdge.cost;
        currentNode = nextEdge.toNode;

        // Mostrar detalles de depuración
        console.log(`Nodo actual: ${currentNode}, camino hasta ahora: ${path.join(" → ")}`);
    }

    return `Ruta Avara (Costo): ${path.join(' → ')} (Costo total: S/ ${totalCost})`;
}


// Ruta Avara por Distancia
// Función para actualizar la tabla comparativa
function updateComparisonTable(currentNode, neighborNode, metricValue, reason) {
    let tableContainer = document.getElementById("comparisonTableContainer");
    let tableBody = document.getElementById("comparisonTable").querySelector("tbody");

    // Mostrar el contenedor de la tabla
    tableContainer.style.display = "block";

    // Crear una nueva fila
    let newRow = document.createElement("tr");
    newRow.innerHTML = `
        <td>${currentNode}</td>
        <td>${neighborNode}</td>
        <td>${metricValue}</td>
        <td>${reason}</td>
    `;

    // Añadir la nueva fila al cuerpo de la tabla
    tableBody.appendChild(newRow);
}

// Función para limpiar la tabla comparativa antes de cada nueva ejecución
function resetComparisonTable() {
    let tableBody = document.getElementById("comparisonTable").querySelector("tbody");
    tableBody.innerHTML = ""; // Vaciar las filas
    document.getElementById("comparisonTableContainer").style.display = "none"; // Ocultar la tabla por defecto
}

// Implementación de Greedy para Distancia con comparación visual
function calculateGreedyDistance(startNode, goalNode) {
    let currentNode = startNode;
    let path = [currentNode];
    let totalDistance = 0;
    let visitedNodes = new Set(); // Mantener un rastreador de nodos visitados para evitar ciclos

    while (currentNode !== goalNode) {
        visitedNodes.add(currentNode); // Añadir el nodo actual a la lista de visitados

        // Obtener todas las aristas salientes desde el nodo actual
        let nextEdges = edges.filter(e => e.fromNode === currentNode && !visitedNodes.has(e.toNode));

        // Si no hay más conexiones disponibles desde el nodo actual, retornamos como error
        if (nextEdges.length === 0) {
            console.log(`No se encontró una ruta válida a partir de ${currentNode}.`);
            return "No se encontró una ruta válida.";
        }

        // Ordenar los vecinos por distancia de menor a mayor
        nextEdges = nextEdges.sort((a, b) => a.distance - b.distance);

        // Evaluar cada nodo vecino y registrar la razón de descarte en la tabla
        nextEdges.forEach((edge, index) => {
            let reason = (index === 0) ? "Seleccionado (Menor distancia)" : "Descarte (Mayor distancia)";
            updateComparisonTable(currentNode, edge.toNode, `${edge.distance} km`, reason);
        });

        // Seleccionar el nodo con menor distancia
        let nextEdge = nextEdges[0];

        // Añadir el nodo seleccionado al camino
        path.push(nextEdge.toNode);
        totalDistance += nextEdge.distance;
        currentNode = nextEdge.toNode;

        // Forzar la conexión si el siguiente nodo es adyacente al destino final
        let isNextToGoal = edges.find(e => e.fromNode === currentNode && e.toNode === goalNode);
        if (isNextToGoal) {
            path.push(goalNode);
            totalDistance += isNextToGoal.distance;

            // Actualizar la tabla para la conexión forzada
            updateComparisonTable(currentNode, goalNode, `${isNextToGoal.distance} km`, "Seleccionado (Conexión directa a destino)");

            console.log(`Forzando conexión directa a destino: ${currentNode} → ${goalNode}`);
            return `Ruta Avara (Distancia): ${path.join(' → ')} (Distancia total: ${totalDistance} km)`;
        }

        // Mostrar el progreso del algoritmo
        console.log(`Nodo actual: ${currentNode}, camino hasta ahora: ${path.join(" → ")}`);
    }

    return `Ruta Avara (Distancia): ${path.join(' → ')} (Distancia total: ${totalDistance} km)`;
}





// Función para actualizar la tabla comparativa
function updateComparisonTable(currentNode, neighborNode, metricValue, reason) {
    let tableContainer = document.getElementById("comparisonTableContainer");
    let tableBody = document.getElementById("comparisonTable").querySelector("tbody");

    // Mostrar el contenedor de la tabla
    tableContainer.style.display = "block";

    // Crear una nueva fila
    let newRow = document.createElement("tr");
    newRow.innerHTML = `
        <td>${currentNode}</td>
        <td>${neighborNode}</td>
        <td>${metricValue}</td>
        <td>${reason}</td>
    `;

    // Añadir la nueva fila al cuerpo de la tabla
    tableBody.appendChild(newRow);
}

// Función para limpiar la tabla comparativa antes de cada nueva ejecución
function resetComparisonTable() {
    let tableBody = document.getElementById("comparisonTable").querySelector("tbody");
    tableBody.innerHTML = ""; // Vaciar las filas
    document.getElementById("comparisonTableContainer").style.display = "none"; // Ocultar la tabla por defecto
}

// Implementación de Greedy para Tiempo con comparación visual
function calculateGreedyTime(startNode, goalNode) {
    let currentNode = startNode;
    let path = [currentNode];
    let totalTime = 0;
    let visitedNodes = new Set(); // Mantener un rastreador de nodos visitados para evitar ciclos

    while (currentNode !== goalNode) {
        visitedNodes.add(currentNode); // Añadir el nodo actual al conjunto de visitados

        // Obtener todos los vecinos desde el nodo actual
        let nextEdges = edges.filter(e => e.fromNode === currentNode && !visitedNodes.has(e.toNode)); // Excluir los ya visitados

        // Verificar si el destino está entre los vecinos
        let directEdgeToGoal = nextEdges.find(e => e.toNode === goalNode);

        // Si encontramos una conexión directa al destino, forzar la selección
        if (directEdgeToGoal) {
            path.push(goalNode);
            totalTime += directEdgeToGoal.time;

            // Actualizar la tabla con la selección forzada
            updateComparisonTable(currentNode, goalNode, `${directEdgeToGoal.time} h`, "Seleccionado (Conexión directa a destino)");

            console.log(`Forzando conexión directa a destino: ${goalNode}`);
            return `Ruta Avara (Tiempo): ${path.join(' → ')} (Tiempo total: ${totalTime} h)`;
        }

        // Ordenar nodos por tiempo de menor a mayor
        nextEdges = nextEdges.sort((a, b) => a.time - b.time);

        // Evaluar cada nodo vecino y registrar la razón de descarte en la tabla
        nextEdges.forEach((edge, index) => {
            let reason = (index === 0) ? "Seleccionado (Menor tiempo)" : "Descarte (Mayor tiempo)";
            updateComparisonTable(currentNode, edge.toNode, `${edge.time} h`, reason);
        });

        // Seleccionar el nodo con menor tiempo
        let nextEdge = nextEdges[0];

        // Si no se encontró ninguna conexión válida, retornar error
        if (!nextEdge) {
            console.log("No se encontró una ruta válida desde el nodo:", currentNode);
            return "No se encontró una ruta válida."; // Devuelve el mensaje si no hay vecinos válidos
        }

        // Añadir el nodo seleccionado al camino
        path.push(nextEdge.toNode);
        totalTime += nextEdge.time;
        currentNode = nextEdge.toNode;

        // Mostrar detalles de depuración
        console.log(`Nodo actual: ${currentNode}, camino hasta ahora: ${path.join(" → ")}`);
    }

    return `Ruta Avara (Tiempo): ${path.join(' → ')} (Tiempo total: ${totalTime} h)`;
}

// Heurística para el algoritmo A*
function heuristic(node, goal) {
    let pos1 = getNodePos(node);
    let pos2 = getNodePos(goal);
    return Math.sqrt(Math.pow(pos1.x - pos2.x, 2) + Math.pow(pos1.y - pos2.y, 2));
}

function calculateAStar(startNode, goalNode) {
    let openSet = [startNode];
    let cameFrom = {};
    let gScore = {};
    let fScore = {};

    // Inicializar los puntajes g y f
    nodes.forEach(node => {
        gScore[node] = Infinity;
        fScore[node] = Infinity;
    });

    gScore[startNode] = 0;
    fScore[startNode] = heuristic(startNode, goalNode);

    // Limpiar la tabla comparativa antes de comenzar
    resetComparisonTable();

    while (openSet.length > 0) {
        // Seleccionar el nodo con el menor valor de fScore
        let current = openSet.reduce((a, b) => fScore[a] < fScore[b] ? a : b);

        if (current === goalNode) {
            // Si llegamos al nodo objetivo, reconstruir el camino
            let path = reconstructPath(cameFrom, current);
            return `Ruta A*: ${path.join(' → ')} (Distancia total: ${gScore[goalNode]} km)`; // Añadir formato estándar
        }

        // Eliminar el nodo actual del conjunto abierto
        openSet = openSet.filter(node => node !== current);

        // Explorar los vecinos del nodo actual
        edges.filter(edge => edge.fromNode === current).forEach(edge => {
            let neighbor = edge.toNode;
            let tentativeGScore = gScore[current] + edge.distance;

            // Actualizar los valores si encontramos un mejor camino
            if (tentativeGScore < gScore[neighbor]) {
                cameFrom[neighbor] = current;
                gScore[neighbor] = tentativeGScore;
                fScore[neighbor] = gScore[neighbor] + heuristic(neighbor, goalNode);

                if (!openSet.includes(neighbor)) {
                    openSet.push(neighbor);
                }

                // Añadir el nodo a la tabla de comparación
                updateComparisonTable(
                    current,
                    neighbor,
                    `Costo acumulado (g) = ${gScore[neighbor].toFixed(2)}<br>Estimado al destino (h) = ${heuristic(neighbor, goalNode).toFixed(2)}<br>Total estimado (f) = ${fScore[neighbor].toFixed(2)}`,
                    "Seleccionado (Mejor camino)"
                );
            } else {
                // Si no es un mejor camino, añadir a la tabla con el motivo de descarte
                updateComparisonTable(
                    current,
                    neighbor,
                    `Costo acumulado (g) = ${gScore[neighbor].toFixed(2)}<br>Estimado al destino (h) = ${heuristic(neighbor, goalNode).toFixed(2)}<br>Total estimado (f) = ${fScore[neighbor].toFixed(2)}`,
                    "Descarte (Camino subóptimo)"
                );
            }
        });
    }

    return "No se encontró una ruta válida.";
}
// Extractor de nodos para A*
function extractPathNodesAStar(result) {
    console.log("Resultado a analizar en extractPathNodesAStar:", result);
    const pathMatch = result.match(/Ruta A\*: ([\w\s→]+) \(Distancia total:/);
    if (pathMatch) {
        const path = pathMatch[1].split(" → ");
        console.log("Ruta extraída A*:", path);
        return path;
    } else {
        console.log("No se encontró un formato de ruta válido en A*:", result);
        return [];
    }
}

// Extractor de nodos para el algoritmo avaro (Costo)
function extractPathNodesGreedyCost(result) {
    console.log("Resultado a analizar en extractPathNodesGreedyCost:", result);
    // Ajuste en la expresión regular para capturar el formato esperado
    const pathMatch = result.match(/Ruta Avara \(Costo\): ([\w\s→]+) \(Costo total:/);
    if (pathMatch) {
        const path = pathMatch[1].split(" → ").map(node => node.trim());
        console.log("Ruta extraída Greedy Cost:", path);
        return path;
    } else {
        console.log("No se encontró un formato de ruta válido en Greedy Cost:", result);
        return [];
    }
}


// Extractor de nodos para el algoritmo avaro (Distancia)
function extractPathNodesGreedyDistance(result) {
    console.log("Resultado a analizar en extractPathNodesGreedyDistance:", result);
    const pathMatch = result.match(/Ruta Avara \(Distancia\): ([\w\s→]+) \(Distancia total:/);
    if (pathMatch) {
        const path = pathMatch[1].split(" → ");
        console.log("Ruta extraída Greedy Distance:", path);
        return path;
    } else {
        console.log("No se encontró un formato de ruta válido en Greedy Distance:", result);
        return [];
    }
}

// Extractor de nodos para el algoritmo avaro (Tiempo)
function extractPathNodesGreedyTime(result) {
    console.log("Resultado a analizar en extractPathNodesGreedyTime:", result);

    // Si el resultado contiene el mensaje de error, salir de inmediato
    if (result.includes("No se encontró una ruta válida")) {
        console.log("Mensaje de error detectado en Greedy Time:", result);
        return []; // Devuelve un arreglo vacío ya que no hay nodos para mostrar
    }

    // Buscar el patrón de la ruta en el resultado
    const pathMatch = result.match(/Ruta Avara \(Tiempo\): ([\w\s→]+) \(Tiempo total:/);
    if (pathMatch) {
        const path = pathMatch[1].split(" → ");
        console.log("Ruta extraída Greedy Time:", path);
        return path;
    } else {
        console.log("No se encontró un formato de ruta válido en Greedy Time:", result);
        return [];
    }
}

// Extractor de nodos para el algoritmo Tonto
function extractPathNodesDumb(result) {
    console.log("Resultado a analizar en extractPathNodesDumb:", result);
    
    // Ajustar la expresión regular para capturar correctamente el camino
    const pathMatch = result.match(/Ruta Tonta:\s*([\w\s→]+)\s*\(Total nodos:/);
    
    if (pathMatch) {
        const path = pathMatch[1].split(" → ").map(node => node.trim()); // Eliminar espacios en cada nodo
        console.log("Ruta extraída Dumb:", path);
        return path;
    } else {
        console.log("No se encontró un formato de ruta válido en Dumb:", result);
        return [];
    }
}
// Función para mostrar la tabla comparativa y actualizarla dinámicamente
function updateComparisonTable(currentNode, neighborNode, metricValue, reason) {
    let tableContainer = document.getElementById("comparisonTableContainer");
    let tableBody = document.getElementById("comparisonTable").querySelector("tbody");

    // Mostrar el contenedor de la tabla
    tableContainer.style.display = "block";

    // Crear una nueva fila
    let newRow = document.createElement("tr");
    newRow.innerHTML = `
        <td>${currentNode}</td>
        <td>${neighborNode}</td>
        <td>${metricValue}</td>
        <td>${reason}</td>
    `;

    // Añadir la nueva fila al cuerpo de la tabla
    tableBody.appendChild(newRow);
}

// Función para limpiar la tabla comparativa antes de cada nueva ejecución
function resetComparisonTable() {
    let tableBody = document.getElementById("comparisonTable").querySelector("tbody");
    tableBody.innerHTML = ""; // Vaciar las filas
    document.getElementById("comparisonTableContainer").style.display = "none"; // Ocultar la tabla por defecto
}
// Extractor de nodos para Dijkstra
function extractPathNodesDijkstra(result) {
    console.log("Resultado a analizar en extractPathNodesDijkstra:", result);
    const pathMatch = result.match(/Ruta Dijkstra: ([\w\s→]+) \(Costo total:/);
    if (pathMatch) {
        const path = pathMatch[1].split(" → ");
        console.log("Ruta extraída Dijkstra:", path);
        return path;
    } else {
        console.log("No se encontró un formato de ruta válido en Dijkstra:", result);
        return [];
    }
}