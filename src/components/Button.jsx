export default function Button({onclick, title, Icon, additionlClass, type="button"}){
    return <>
    <button onClick={onclick} type={type} className={`text-gray-800 px-3 py-2 cursor-pointer border rounded-lg border-gray-300 text-sm flex gap-1 items-center ${additionlClass}`}>
        {Icon && <Icon size="sm"/>}
        {title}
    </button>
    </>
}