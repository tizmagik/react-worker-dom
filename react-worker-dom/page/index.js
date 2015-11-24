import ReactDom from './ReactDomImpl';

window.ReactWorkerDom = {
    init: function(worker, container) {
        worker.onmessage = function(e) {
            e.data.forEach(function(data) {
                var node = ReactDom.get(data.id);
                switch (data.method) {
                    case 'constructor':
                        ReactDom.create.apply(ReactDom, data.args.concat(data.id));
                        break;
                    case 'render':
                        var rootNode = ReactDom.get(data.id);
                        container.appendChild(rootNode.ref);
                        break;
                    case 'append':
                        var node2 = ReactDom.get(data.args[0].id);
                        node.append(node2);
                        break;
                    default:
                        if (typeof node[data.method] === 'function') {
                            node[data.method].apply(node, data.args);
                        } else {
                            console.log('Cannot run %s on Node with id %s', data.method, data.id);
                        }
                }
            });
        };
    }
};