class SLLQueue {
    constructor() {
        this.head = null;
        this.tail = null;
        this.n = 0;
    }

    add(x) {
        const u = new NodeSLL(x);
        if (this.n === 0) {
            this.head = u;
        } else {
            this.tail.next = u;
        }
        this.tail = u;
        this.n++;
        return true;
    }

    remove() {
        if (this.n === 0) {
            throw new Error("Queue is empty!");
        }
        const popped = this.head;
        this.head = this.head.next;
        this.n--;
        if (this.n === 0) {
            this.tail = null;
        }
        return popped.x;
    }

    reverse() {
        let prev = null;
        let cur = this.head;
        for (let i = 0; i < this.n; i++) {
            const nextNodeSLL = cur.next;
            cur.next = prev;
            prev = cur;
            cur = nextNodeSLL;
        }
        this.head = prev;
    }

    size() {
        return this.n;
    }

    toString() {
        let s = "[";
        let u = this.head;
        while (u !== null) {
            s += `${u.x}`;
            u = u.next;
            if (u !== null) {
                s += ",";
            }
        }
        return s + "]";
    }

    *[Symbol.iterator]() {
        let iterator = this.head;
        while (iterator !== null) {
            yield iterator.x;
            iterator = iterator.next;
        }
    }
}

class NodeSLL {
    constructor(x) {
        this.next = null;
        this.x = x;
    }
}


class NodeBinary {
    constructor(key = null, val = null) {
        this.parent = this.left = this.right = null;
        this.k = key;
        this.v = val;
    }

    set_key(x) {
        this.k = x;
    }

    set_val(v) {
        this.v = v;
    }

    insert_left(u) {
        this.left = u;
        this.left.parent = this;
        return this.left;
    }

    insert_right(u) {
        this.right = u;
        this.right.parent = this;
        return this.right;
    }

    toString() {
        return `(${this.k}, ${this.v})`;
    }
}

class BinaryTree {
    constructor() {
        this.r = null;
    }

    depth(u) {
        if (!u) return -1;
        let d = 0;
        let current_node = u;
        while (current_node !== this.r) {
            current_node = current_node.parent;
            d += 1;
        }
        return d;
    }

    _height(u) {
        if (!u) return -1;
        return 1 + Math.max(this._height(u.left), this._height(u.right));
    }

    height() {
        return this._height(this.r);
    }

    _size(u) {
        if (!u) return 0;
        return 1 + this._size(u.left) + this._size(u.right);
    }

    size() {
        return this._size(this.r);
    }

    bf_order() {
        const nodes = [];
        const q = new SLLQueue(); // Assuming SLLQueue is implemented
        if (this.r) q.add(this.r);
        while (q.size() > 0) {
            const u = q.remove();
            nodes.push(u);
            if (u.left) q.add(u.left);
            if (u.right) q.add(u.right);
        }
        return nodes;
    }

    _in_order(u) {
        const nodes = [];
        if (u.left) nodes.push(...this._in_order(u.left));
        nodes.push(u);
        if (u.right) nodes.push(...this._in_order(u.right));
        return nodes;
    }

    in_order() {
        return this._in_order(this.r);
    }

    _post_order(u) {
        const nodes = [];
        if (u.left) nodes.push(...this._post_order(u.left));
        if (u.right) nodes.push(...this._post_order(u.right));
        nodes.push(u);
        return nodes;
    }

    post_order() {
        return this._post_order(this.r);
    }

    _pre_order(u) {
        const nodes = [u];
        if (u.left) nodes.push(...this._pre_order(u.left));
        if (u.right) nodes.push(...this._pre_order(u.right));
        return nodes;
    }

    pre_order() {
        return this._pre_order(this.r);
    }

    toString() {
        const nodes = this.bf_order();
        const nodes_str = nodes.map(node => node.toString());
        return nodes_str.join(', ');
    }
}

class BinarySearchTree extends BinaryTree {
    constructor() {
        super();
        this.n = 0;
    }

    add(key, value = null) {
        const newNode = new NodeBinary(key, value);
        const parent = this._findLast(key);
        return this._addChild(parent, newNode);
    }

    find(key) {
        const node = this._findEq(key);
        return node ? node : null;
    }

    remove(key) {
        const node = this._findEq(key);
        if (!node) throw new Error("Key is not in tree");
        const value = node.v;
        this._removeNode(node);
        return value;
    }

    _findEq(key) {
        let current = this.r;
        while (current) {
            if (key < current.k) {
                current = current.left;
            } else if (key > current.k) {
                current = current.right;
            } else {
                return current;
            }
        }
        return null;
    }

    _findLast(key) {
        let current = this.r;
        let parent = null;
        while (current) {
            parent = current;
            if (key < current.k) {
                current = current.left;
            } else if (key > current.k) {
                current = current.right;
            } else {
                return current;
            }
        }
        return parent;
    }

    _addChild(p, u) {
        if (!p) {
            this.r = u;
        } else {
            if (u.k < p.k) {
                p.left = u;
            } else if (u.k > p.k) {
                p.right = u;
            } else {
                return false;
            }
            u.parent = p;
        }
        this.n++;
        return true;
    }

    _splice(u) {
        let child;
        if (u.left !== null) {
            child = u.left;
        } else {
            child = u.right;
        }
        if (u === this.r) {
            this.r = child;
        } else {
            const p = u.parent;
            if (p.left === u) {
                p.left = child;
            } else {
                p.right = child;
            }
        }
        if (child !== null) {
            child.parent = u.parent;
        }
        this.n--;
    }

    _removeNode(u) {
        if (u.left === null || u.right === null) {
            this._splice(u);
        } else {
            let w = u.right;
            while (w.left !== null) {
                w = w.left;
            }
            u.k = w.k;
            u.v = w.v;
            this._splice(w);
        }
    }

    clear() {
        this.r = null;
        this.n = 0;
    }

    *[Symbol.iterator]() {
        let u = this.firstNode();
        while (u !== null) {
            yield u.k;
            u = this.nextNode(u);
        }
    }

    firstNode() {
        let w = this.r;
        if (w === null) {
            return null;
        }
        while (w.left !== null) {
            w = w.left;
        }
        return w;
    }

    nextNode(w) {
        if (w.right !== null) {
            w = w.right;
            while (w.left !== null) {
                w = w.left;
            }
        } else {
            while (w.parent !== null && w.parent.left !== w) {
                w = w.parent;
            }
            w = w.parent;
        }
        return w;
    }
}

function newGame() {
    deleteTree()
    makeTree()

}

function makeTree() {
    // Initiate the binary search tree
    const bst = new BinarySearchTree();

    for (var i = 0; i < 15; i++) {
        const random_key = getRandomInt(1, 10)
        bst.add(random_key, 'x')
    }

    const in_order = bst.in_order()
    const pre_order = bst.pre_order()
    const post_order = bst.post_order()
    const bf_order = bst.bf_order()
    const tree_container = document.getElementById('treeContainer');
    const node_keys_divs = {};
    var player_nodes = []
    const offsetX = 50
    const offsetY = 60

    bf_order.forEach(node => {
        // Each node is a div that follows 'node' styles 
        const div = document.createElement('div');
        div.className = 'node';
        div.textContent = node.k;
        var mult = (bst.height() - bst.depth(node) + 0.5)

        // If the node is a child of the root node, make the multiplier less
        if (node == bst.r.left || node == bst.r.right) {
            mult = (bst.height() - bst.depth(node) + 0.5) / 1.5
        }

        // If the node is the root, position it to the middle of the screen
        if (node == bst.r) {
            div.style.left = window.innerWidth / 2 + 'px'
            div.style.top = '200px'
        }
        else {
            if (node == node.parent.left) {
                setTimeout(() => {
                    var parent_x = node_keys_divs[node.parent.k].getBoundingClientRect().left
                    var parent_y = node_keys_divs[node.parent.k].getBoundingClientRect().top

                    div.style.left = parent_x - 10 - (mult * offsetX) / (bst.depth(node) / 1.5) + 'px'

                    div.style.top = parent_y + offsetY + 'px'


                })
            }
            if (node == node.parent.right) {
                setTimeout(() => {
                    var parent_x = node_keys_divs[node.parent.k].getBoundingClientRect().left
                    var parent_y = node_keys_divs[node.parent.k].getBoundingClientRect().top
                    div.style.left = parent_x + 10 + ((mult * offsetX) / (bst.depth(node) / 1.5)) + 'px'

                    div.style.top = parent_y + offsetY + 'px'

                })
            }
            // Draw a line between the child and parent nodes
            setTimeout(() => {
                connectDivs(node_keys_divs[node.k], node_keys_divs[node.parent.k])

            })

        }

        // Always add a click listener, append to dict, and append to DOM
        addClickEventListener(div, node.k)
        node_keys_divs[node.k] = div;
        tree_container.appendChild(div)

    })

    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg")
    svg.setAttribute("xmlns", "http://www.w3.org/2000/svg")
    svg.setAttribute("version", "1.1")
    svg.setAttribute("width", "100%")
    svg.setAttribute("height", "100%")
    tree_container.appendChild(svg)
    const correct_keys_display = document.getElementById('correct-nodes')
    const clear_button = document.getElementById('clear')
    const player_keys_display = document.getElementById('player-nodes')
    const win_lose_display = document.getElementById('win-lose')
    var correct_keys = []
    correct_keys_display.textContent = 'Correct nodes: '
    player_keys_display.textContent = 'Your nodes: '
    win_lose_display.textContent = ''

    const delayIncrement = 250;
    document.getElementById('inorder').addEventListener('click', function () {
        correct_keys = []
        var current = in_order

        // For each node add a longer timeout so they flash in order
        current.forEach((node, index) => {
            correct_keys.push(node.k)
            setTimeout(() => {
                const div = node_keys_divs[node.k]
                div.style.backgroundColor = 'darkseagreen'
                setTimeout(() => {
                    div.style.backgroundColor = ''
                }, delayIncrement);
            }, index * delayIncrement * 2)
        })
        correct_keys_display.textContent = 'Correct nodes: ' + correct_keys
        if (JSON.stringify(player_nodes) === JSON.stringify(correct_keys)) {
            win_lose_display.textContent = 'Correct!'
        }
        else {
            win_lose_display.textContent = 'Incorrect :('

        }
    })

    document.getElementById('preorder').addEventListener('click', function () {
        correct_keys = []
        var current = pre_order

        current.forEach((node, index) => {
            correct_keys.push(node.k)

            setTimeout(() => {
                const div = node_keys_divs[node.k]
                div.style.backgroundColor = 'darkseagreen'
                setTimeout(() => {
                    div.style.backgroundColor = ''
                }, delayIncrement);
            }, index * delayIncrement * 2)
        })
        correct_keys_display.textContent = 'Correct nodes: ' + correct_keys

        if (JSON.stringify(player_nodes) === JSON.stringify(correct_keys)) {
            console.log('hooray')
            win_lose_display.textContent = 'Correct!'
        }
        else {
            win_lose_display.textContent = 'Incorrect :('

        }
    })
    document.getElementById('postorder').addEventListener('click', function () {
        correct_keys = []
        var current = post_order

        current.forEach((node, index) => {
            correct_keys.push(node.k)

            setTimeout(() => {
                const div = node_keys_divs[node.k]
                div.style.backgroundColor = 'darkseagreen'
                setTimeout(() => {
                    div.style.backgroundColor = ''
                }, delayIncrement);
            }, index * delayIncrement * 2)
        });
        correct_keys_display.textContent = 'Correct nodes: ' + correct_keys

        if (JSON.stringify(player_nodes) === JSON.stringify(correct_keys)) {
            console.log('hooray')
            win_lose_display.textContent = 'Correct!'
        }
        else {
            win_lose_display.textContent = 'Incorrect :('

        }
    })
    document.getElementById('breadthorder').addEventListener('click', function () {
        var current = bf_order
        correct_keys = []
        current.forEach((node, index) => {
            correct_keys.push(node.k)

            setTimeout(() => {
                const div = node_keys_divs[node.k]
                div.style.backgroundColor = 'darkseagreen'
                setTimeout(() => {
                    div.style.backgroundColor = ''
                }, delayIncrement);
            }, index * delayIncrement * 2)
        })
        correct_keys_display.textContent = 'Correct nodes: ' + correct_keys

        if (JSON.stringify(player_nodes) === JSON.stringify(correct_keys)) {
            win_lose_display.textContent = 'Correct!'
        }
        else {
            win_lose_display.textContent = 'Incorrect :('

        }
    })

    function connectDivs(div1, div2) {
        var new_line = document.createElementNS('http://www.w3.org/2000/svg', 'line')
        const div1_rect = div1.getBoundingClientRect()
        const div2_rect = div2.getBoundingClientRect()
        new_line.setAttribute('x1', div1_rect.left + div1_rect.width / 2)
        new_line.setAttribute('y1', div1_rect.top + div1_rect.height / 2)
        new_line.setAttribute('x2', div2_rect.left + div2_rect.width / 2)
        new_line.setAttribute('y2', div2_rect.top + div2_rect.height / 2)
        new_line.setAttribute('stroke', 'darkblue')
        new_line.setAttribute('stroke-width', '2')
        svg.appendChild(new_line)
    }

    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }


    function playHit(key) {
        var audio = new Audio('hit.mp3');
        audio.play();
        player_nodes.push(key)
        player_keys_display.textContent = 'Your nodes: ' + player_nodes

    }

    function addClickEventListener(nodeElement, key) {
        nodeElement.addEventListener('click', function () {
            playHit(key);
        });
    }

    clear_button.addEventListener('click', function () {
        player_nodes = []
        player_keys_display.textContent = 'Your nodes: '
        correct_keys_display.textContent = 'Correct nodes: '
        win_lose_display.textContent = ''

    })
}

function deleteTree() {
    var nodes = document.querySelectorAll('.node');

    nodes.forEach(function (node) {
        node.remove();
    });
    var svgs = document.querySelectorAll('svg');

    svgs.forEach(function (svg) {
        svg.remove()
    });

}