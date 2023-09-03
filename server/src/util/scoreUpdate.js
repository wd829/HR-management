const updateScore = (dataFromDB, dataFromFrontend) => {

    const dbInComeLength = dataFromDB.inCome.length;
    const dbOutComeLength = dataFromDB.outCome.length;
    const inComeLength = dataFromFrontend.inCome.length
    const outComeLength = dataFromFrontend.outCome.length

    const dbIncome = dataFromDB.inCome
    const dbOutCome = dataFromDB.outCome
    const income = dataFromFrontend.inCome
    const outCome = dataFromFrontend.outCome

    if (dbIncome.toLowerCase().contains('k') && income.toLowerCase().contains('k')) {
        dbIncome = parseFloat(dbIncome.slice(0, dbInComeLength - 1)) + parseFloat(income.slice(0, inComeLength - 1))
        dbIncome += 'K'
    }
    if (dbIncome.toLowerCase().contains('k') && income.toLowerCase().contains('$')) {
        dbIncome = parseFloat(dbIncome.slice(0, dbInComeLength - 1)) + parseFloat(income.slice(0, inComeLength - 1))/1000
        dbIncome += 'K'
    }
    if (dbIncome.toLowerCase().contains('k') && (!income.toLowerCase().contains('k') || !income.toLowerCase().contains('$'))) {
        dbIncome = parseFloat(dbIncome.slice(0, dbInComeLength - 1)) + parseFloat(income.slice(0, inComeLength - 1))
        dbIncome += 'K'
    }
    if (dbIncome.toLowerCase().contains('$') && income.toLowerCase().contains('k')) {
        dbIncome = parseFloat(dbIncome.slice(0, dbInComeLength - 1)) + parseFloat(income.slice(0, inComeLength - 1))
        dbIncome += 'K'
    }
    if (dbIncome.toLowerCase().contains('$') && income.toLowerCase().contains('$')) {
        dbIncome = parseFloat(dbIncome.slice(0, dbInComeLength - 1)) + parseFloat(income.slice(0, inComeLength - 1))
        dbIncome += 'K'
    }
    if (dbIncome.toLowerCase().contains('$') && (!income.toLowerCase().contains('k') || !income.toLowerCase().contains('$'))) {
        dbIncome = parseFloat(dbIncome.slice(0, dbInComeLength - 1)) + parseFloat(income.slice(0, inComeLength - 1))
        dbIncome += 'K'
    }
    if ((!dbIncome.toLowerCase().contains('k') || !dbIncome.toLowerCase().contains('$')) && income.toLowerCase().contains('k')) {
        dbIncome = parseFloat(dbIncome.slice(0, dbInComeLength - 1)) + parseFloat(income.slice(0, inComeLength - 1))
        dbIncome += 'K'
    }
    if ((!dbIncome.toLowerCase().contains('k') || !dbIncome.toLowerCase().contains('$')) && income.toLowerCase().contains('$')) {
        dbIncome = parseFloat(dbIncome.slice(0, dbInComeLength - 1)) + parseFloat(income.slice(0, inComeLength - 1))
        dbIncome += 'K'
    }


    if (dbOutCome.toLowerCase().contains('k') && outCome.toLowerCase().contains('k')) {
        dbOutCome = parseFloat(dbOutCome.slice(0, dbOutComeLength - 1)) + parseFloat(outCome.slice(0, outComeLength - 1))
        dbOutCome += 'K'
    }
    if (dbOutCome.toLowerCase().contains('k') && outCome.toLowerCase().contains('$')) {
        dbOutCome = parseFloat(dbOutCome.slice(0, dbOutComeLength - 1)) + parseFloat(outCome.slice(0, outComeLength - 1))
        dbOutCome += 'K'
    }
    if (dbOutCome.toLowerCase().contains('k') && (!outCome.toLowerCase().contains('k') || !income.toLowerCase().contains('$'))) {
        dbOutCome = parseFloat(dbOutCome.slice(0, dbOutComeLength - 1)) + parseFloat(outCome.slice(0, outComeLength - 1))
        dbOutCome += 'K'
    }
    if (dbOutCome.toLowerCase().contains('$') && outCome.toLowerCase().contains('k')) {
        dbOutCome = parseFloat(dbOutCome.slice(0, dbOutComeLength - 1)) + parseFloat(outCome.slice(0, outComeLength - 1))
        dbOutCome += 'K'
    }
    if (dbOutCome.toLowerCase().contains('$') && outCome.toLowerCase().contains('$')) {
        dbOutCome = parseFloat(dbOutCome.slice(0, dbOutComeLength - 1)) + parseFloat(outCome.slice(0, outComeLength - 1))
        dbOutCome += 'K'
    }
    if (dbOutCome.toLowerCase().contains('$') && (!outCome.toLowerCase().contains('k') || !outCome.toLowerCase().contains('$'))) {
        dbOutCome = parseFloat(dbOutCome.slice(0, dbOutComeLength - 1)) + parseFloat(outCome.slice(0, outComeLength - 1))
        dbOutCome += 'K'
    }
    if ((!dbOutCome.toLowerCase().contains('k') || !dbOutCome.toLowerCase().contains('$')) && outCome.toLowerCase().contains('k')) {
        dbOutCome = parseFloat(dbOutCome.slice(0, dbOutComeLength - 1)) + parseFloat(outCome.slice(0, outComeLength - 1))
        dbOutCome += 'K'
    }
    if ((!dbOutCome.toLowerCase().contains('k') || !dbOutCome.toLowerCase().contains('$')) && outCome.toLowerCase().contains('$')) {
        dbOutCome = parseFloat(dbOutCome.slice(0, dbOutComeLength - 1)) + parseFloat(outCome.slice(0, outComeLength - 1))
        dbOutCome += 'K'
    }

    return { dbIncome, dbOutCome }
}

export default updateScore
