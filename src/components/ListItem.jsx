import {memo, useState} from "react";
import {InputTextarea} from "primereact/inputtextarea";

function ListItem({updateListItem, updatePages, ...rest}) {
    const {pos, page, description} = rest;
    const [txt, setTxt] = useState(description || '');

    return (
        <div className="listItem">
            <span>{pos}</span>
            <InputTextarea
                value={txt}
                onChange={(e) => {
                    setTxt(e.target.value);
                    console.log(e.target.value)
                }}
                onBlur={() => updateListItem(pos, {
                    ...rest,
                    description: txt
                })}
            />
            <div className='pages'>
                <span onClick={() => updatePages(pos, page + 1)}>+</span>
                <input
                    value={page}
                    type='number'
                    onChange={(e) => updatePages(pos, parseInt(e.target.value))}
                />
                <span onClick={() => updatePages(pos, page - 1)}>-</span>
            </div>
        </div>
    );
}

export default ListItem