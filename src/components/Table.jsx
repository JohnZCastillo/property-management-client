
export default function Table({headers, data}){

    return (
        <>
            <div className="px-2 pt-2 pb-1 border border-gray-300 rounded">
                <div className="overflow-auto custom-scrollbar">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-gray-300 sticky top-0 z-51 bg-white">
                                {headers.map(header => (
                                    <td className={header.style}>{header.title}</td>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                           { data.map((content,index) => (
                                <tr className="border-b border-gray-300  last:border-0">
                                    {headers.map(header => {

                                        if(header.mapper){
                                            return (
                                                <td className={`${header?.contentStyle ?? 'text-center'}`}>
                                                    {header.mapper({content,header,index, value: content[header.key]})}
                                                </td>
                                            )
                                        }

                                        return (<td className={`${header?.contentStyle ?? 'text-center'}`} >{content[header.key]}</td>)
                                    })}
                                </tr>
                                ))
                            }

                            {(data && data.length <= 0) && (
                                <tr>
                                    <td colSpan={headers.length}>
                                        <p className="text-center py-5 text-gray-500">Empty</p>
                                    </td>
                                </tr>
                            ) }
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    )
}