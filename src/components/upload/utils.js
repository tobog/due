export const formatRate = function (speed = 0) {
     if (speed > 1073741824) {
        speed = (speed / 1073741824).toFixed(2) + 'G';
    } else if (speed > 1048576) {
        speed = (speed / 1048576).toFixed(1) + 'M';
    } else if (speed > 1024) {
        speed = parseInt(speed / 1024) + 'K';
    } else {
        speed = parseInt(speed) + 'B';
    }
    return speed;
};

export const formatTime = function (time = 0) {
    if (time > 3600) {
        time = (time / 3600).toFixed(1) + 'h';
    } else if (time > 120) {
        time = parseInt(time / 60) + 'min';
    } else {
        time = parseInt(time) + 's';
    }
    return time;
};

export const formatFile = function (name) {
    const format = name.split('.').pop().toLowerCase() || '';
    let type = 'document';
    if (['gif', 'jpg', 'jpeg', 'png', 'bmp', 'webp'].indexOf(format) > -1) {
        type = 'image';
    }
    if (['mp4', 'm3u8', 'rmvb', 'avi', 'swf', '3gp', 'mkv', 'flv'].indexOf(format) > -1) {
        type = 'film-marker';
    }
    if (['mp3', 'wav', 'wma', 'ogg', 'aac', 'flac'].indexOf(format) > -1) {
        type = 'headphone';
    }
    if (['doc', 'txt', 'docx', 'pages', 'epub', 'pdf'].indexOf(format) > -1) {
        type = 'document-text';
    }
    if (['numbers', 'csv', 'xls', 'xlsx'].indexOf(format) > -1) {
        type = 'stats-bars';
    }
    if (['keynote', 'ppt', 'pptx'].indexOf(format) > -1) {
        type = 'videocamera';
    }
    return type;
};

