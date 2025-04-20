import React from 'react';

function Label({ text, size, color }) {
    let header;
    const style = { color: color };

    switch (size) {
        default:
            header = <h1 style={style}>{text}</h1>;
            break;
        case '1':
            header = <h1 style={style}>{text}</h1>;
            break;
        case '2':
            header = <h2 style={style}>{text}</h2>;
            break;
        case '3':
            header = <h3 style={style}>{text}</h3>;
            break;
        case '4':
            header = <h4 style={style}>{text}</h4>;
            break;
    }

    return (
        <div>
            {header}
        </div>
    );
}

export default Label;