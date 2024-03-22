function convert(date){
    let dateNow = new Date()
    let createdDate = date
    let howOld = dateNow - createdDate
    let minutes = Math.round(howOld/1000/60)
    let hours = Math.round(minutes/60)
    let days = Math.round(hours/24)
    if (days > 1) {
        return `created ${days} days ago`
    }else if (hours > 1) {
        return `created ${hours} hours ago`
    }else{
        return `created ${minutes} minutes ago`
    }
}
module.exports = convert