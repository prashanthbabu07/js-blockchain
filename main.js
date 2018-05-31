const SHA256 = require("crypto-js/sha256");

class Transaction 
{
    constructor(fromAddress, toAddress, amount)
    {
        this.fromAddress = fromAddress;
        this.toAddress = toAddress;
        this.amount = amount;
    }
}

class Block
{
    constructor(timestamp, transactions, previousHash = '')
    {
        this.timestamp = timestamp;
        this.transactions = transactions;
        this.previousHash = previousHash;
        this.hash = this.calculateHash();
        this.nounce = 0;
    }

    calculateHash()
    {
        return SHA256(`${this.timestamp}${JSON.stringify(this.transactions)}${this.previousHash}${this.nounce}`).toString();
    }

    mineBlock(difficulty)
    {
        while (this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0"))
        {
            this.nounce++;
            this.hash = this.calculateHash();
        }

        console.log(`Block mined: ${this.hash}`);
    }
}

class BlockChain
{
    constructor()
    {
        this.chain = [this.createGenesisBlock()];
        this.difficulty = 4;
        this.pendingTransactions = [];
        this.miningReward = 100;
    }

    createGenesisBlock()
    {
        return new Block(Date.now(), "Genesis Block", "0");
    }

    getLatestBlock()
    {
        return this.chain[this.chain.length - 1];
    }

    addBlock(newBlock)
    {
        newBlock.previousHash = this.getLatestBlock().hash;
        // newBlock.hash = newBlock.calculateHash();
        newBlock.mineBlock(this.difficulty);
        this.chain.push(newBlock);
    }

    minePendingTransactions(miningRewardAddress)
    {
        var block = new Block(Date.now(), this.pendingTransactions);
        block.previousHash = this.getLatestBlock().hash;
        block.mineBlock(this.difficulty);
        console.log("block successfully mined...");
        this.chain.push(block);

        this.pendingTransactions = [
            new Transaction(null, miningRewardAddress, this.miningReward)
        ];
    }

    createTransaction(transaction) 
    {
        this.pendingTransactions.push(transaction);
    }

    getBalance(address)
    {
        var balance = 0;
        for(const block of this.chain)
        {
            for(const tran of block.transactions)
            {
                if(tran.fromAddress === address)
                {
                    balance -= tran.amount;
                }

                if(tran.toAddress === address)
                {
                    balance += tran.amount;
                }
            }
        }

        return balance;
    }

    isChainValid()
    {
        for (var i = 1; i < this.chain.length; i++)
        {
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i - 1];

            if (currentBlock.hash !== currentBlock.calculateHash()) 
            {
                console.log("hash comparison failed");
                return false;
            }

            if (currentBlock.previousHash !== previousBlock.hash)
            {
                console.log("link hash failed");
                return false;
            }
        }

        return true;
    }
}

var newCoin = new BlockChain();

newCoin.createTransaction(new Transaction("address1", "address2", 100));
newCoin.createTransaction(new Transaction("address2", "address1", 50));

newCoin.minePendingTransactions("Prashanth");
console.log("balance = " + newCoin.getBalance("Prashanth")); 
newCoin.minePendingTransactions("Prashanth");
console.log("balance = " + newCoin.getBalance("Prashanth"));


// console.log("mining block 1...")
// chilzinCoin.addBlock(new Block("29/05/2018", { amount: 5 }));
// console.log("mining block 2...")
// chilzinCoin.addBlock(new Block("29/05/2018", { amount: 15 }));

console.log(JSON.stringify(newCoin, null, 4));

console.log("Is blockchain valid? " + newCoin.isChainValid());

// chilzinCoin.chain[1].data = {amount: 100};
// chilzinCoin.chain[1].hash =  chilzinCoin.chain[1].calculateHash();

// console.log("Is blockchain valid? " + chilzinCoin.isChainValid());