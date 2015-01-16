module.exports = {
    filesize: function(bytes, precision) {

        var kilobyte = 1024,
            megabyte = kilobyte * 1024,
            gigabyte = megabyte * 1024

        if (bytes >= 0 && bytes < kilobyte)
            return bytes + ' B'

        else if (bytes >= kilobyte && bytes < megabyte)
            return (bytes / kilobyte).toFixed(precision) + ' KB'

        else if (bytes >= megabyte && bytes < gigabyte)
            return (bytes / megabyte).toFixed(precision) + ' MB'

        else if (bytes >= gigabyte)
            return (bytes / gigabyte).toFixed(precision) + ' GB'

        else
            return bytes + ' B'
    },

    toTime: function(t) {

        var ms = t % 1e3
        t = (t - ms) / 1e3

        var secs = t % 60
        t = (t - secs) / 60

        var mins = t % 60,
            hrs  = (t - mins) / 60,
            time

        function add(what, suffix) {
            if (time)
                time += ' + '
            else
                time = ''

            time += what + ' ' + suffix
        }

        add(hrs,  'hrs')
        add(mins, 'mins')
        add(secs, 'secs')
        add(ms,   'ms')

        return time
    }
}
