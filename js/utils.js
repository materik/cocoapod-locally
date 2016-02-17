
module.exports = utils = {

    diff: function(x, y) {
        return x.filter(function(n) {
            return y.indexOf(n) == -1;
        });
    },

    intersect: function(x, y) {
        return x.filter(function(n) {
            return y.indexOf(n) != -1;
        });
    },

}

