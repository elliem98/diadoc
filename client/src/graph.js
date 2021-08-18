export default {
        
    pathForId(id) {
        if (!id.path) {
            console.log("Invalid id's path requested", id);
            return id;
        }

        return id.path;
    },

    idForPath(path) {
        if (typeof(path) != 'string') {
            console.log("Invalid path's ID requested", path);
            return path;
        }
        
        return { path };
    },

    getNode(root, id) {
        return id.path.substring(1).split('/').reduce((l, r) => l[r], root)
    },

    getRelated(root, id) {
        if (!id) {
            return []
        }

        var parent = id.path.split('/');
        parent.pop();
        parent = parent.join('/');
        
        var results = [];
        if (parent && parent != '/') {
            results.push({path: parent});
        }

        var node = this.getNode(root, id);
        for (const child in node) {
            if (child != '__meta')
                results.push({ path: id.path + '/' + child });
        }

        return results;
    },

    closestPath(paths, id) {
        let binarySearch = function (arr, x, start, end) { // God I love stack overflow
            if (start > end) return ;
            
            let mid=Math.floor((start + end)/2);
            
            if (arr[mid]===x) return true;
                    
            if(arr[mid] > x)
                return binarySearch(arr, x, start, mid-1);
            else
                return binarySearch(arr, x, mid+1, end);
        }

        paths.sort();
        let parts = id.path.substring(1).split('/');
        while (parts.length > 0 && !binarySearch(paths, '/' + parts.join('/'), 0, paths.length)) {
            parts.pop();
        }

        return '/' + parts.join('');
    },

    walk(n, f) { // Calls f(id, node) for full tree, skipping __meta nodes. Return false to not enumerate children of id
        function __walk(path, node) {
            if (f(this.idForPath(path), node)) {
                for (var name in node)
                    if (typeof(node[name]) == 'object' && name != '__meta')
                        __walk.call(this, path + '/' + name, node[name]);
            }
        }

        __walk.call(this, '', n);
    },

    friendlyId(id) {
        return id.path;
    },
}