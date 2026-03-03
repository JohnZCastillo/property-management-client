export default function Button({onclick, title, Icon}){
    return <>
    <button onClick={onclick} type="button" className="text-gray-800 px-3 py-2 cursor-pointer border rounded-lg border-gray-300 text-sm flex gap-1 items-center">
        {Icon && <Icon size="sm"/>}
        {title}
    </button>
    </>
}