import React, { Component }  from 'react';

export function truncateString(str, n) {
    return str.length > n ? <>{str.substr(0, n - 1)} &hellip;</> : str;
}
