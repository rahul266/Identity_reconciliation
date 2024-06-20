const Contact = require('../databaseModel'); 
const { Op } = require('sequelize'); 

exports.identifyCustomer = async (requestBody) => {
    const { email, phoneNumber } = requestBody;

    let matchingContacts = await Contact.findAll({
        where: {
            [Op.or]: [
                { email: email },
                { phoneNumber: `${phoneNumber}` },
            ],
            deletedAt: null, 
        },
    });
    if (matchingContacts.length===0) {
        const newContact = await createNewContact(email, phoneNumber,"primary")
        return {
            contact: {
                primaryContactId: newContact.id,
                emails: [email],
                phoneNumbers: [phoneNumber],
                secondaryContactIds: [],
            },
        };
    }
    else {
        return await getAllMatchingContacts(matchingContacts,email,phoneNumber)
    }
};

const createNewContact = async (email, phoneNumber, linkPrecedence, linkedId=null) => {
    const newContact = {
        email:`${email}`,
        phoneNumber: `${phoneNumber}`,
        linkedId: linkedId,
        linkPrecedence: linkPrecedence,
        createdAt: new Date(),
        updatedAt: new Date(),
    };
    return await Contact.create(newContact);
}

const getAllMatchingContacts = async (matchingContacts,email,phoneNumber) => {
    const primaryContactId = matchingContacts.map((contact) => {
        if (contact.linkPrecedence === "secondary") {
            return contact.linkedId
        }
        else {
            return contact.id
        }
    })
    const getPrimariesOfSecondaries = await Contact.findAll({
        where: {
            id: primaryContactId
        }
    });
    const getAllSecondaries = await Contact.findAll({
        where: {
            linkedId: getPrimariesOfSecondaries.map((contact) => contact.id)
        }
    })
    const allMatchingContacts = [...getPrimariesOfSecondaries, ...getAllSecondaries]
    
    const lowestIdPrimaryContact = getPrimariesOfSecondaries.reduce((prev, current) => {
        return (prev.id < current.id) ? prev : current;
    }, getPrimariesOfSecondaries[0]);

    const primaryContact = lowestIdPrimaryContact

    if (getPrimariesOfSecondaries.length > 1) {
        const secondaryContacts = getPrimariesOfSecondaries.filter(contact => contact.id !== lowestIdPrimaryContact.id);
        await Promise.all(secondaryContacts.map(async (contact) => {
            await contact.update({ linkedId: primaryContact.id, linkPrecedence: "secondary" });
        }));
        await Promise.all(allMatchingContacts.map(async (contact) => {
            if (contact.linkPrecedence === "secondary") {
                await contact.update({ linkedId: primaryContact.id });
            }
        }));
        allMatchingContacts.map((contact) => {
            if (contact.id !== lowestIdPrimaryContact) {
                contact.linkPrecedence = "secondary"
                contact.linkedId = primaryContact.id
            }
        })
    }

    const emailExists = allMatchingContacts.some(contact => contact.email === email);
    const phoneNumberExists = allMatchingContacts.some(contact => contact.phoneNumber == phoneNumber);

    if (!emailExists || !phoneNumberExists) {
        const createdContact = await createNewContact(email, phoneNumber, "secondary", primaryContact.id)
        return {
            contact: {
                primaryContactId: primaryContact.id,
                emails: [...new Set([primaryContact.email, email, ...allMatchingContacts.map((c) => c.email)])],
                phoneNumbers: [...new Set([primaryContact.phoneNumber, phoneNumber, ...allMatchingContacts.map((c) => c.phoneNumber)])],
                secondaryContactIds: [...allMatchingContacts.filter(contact => contact.linkPrecedence === "secondary").map(contact => contact.id), createdContact.id],
            },
        };
    } else {
        return {
            contact: {
                primaryContactId: primaryContact.id,
                emails: [...new Set([primaryContact.email, ...allMatchingContacts.map((c) => c.email)])],
                phoneNumbers: [...new Set([primaryContact.phoneNumber, ...allMatchingContacts.map((c) => c.phoneNumber)])],
                secondaryContactIds: [...allMatchingContacts.filter(contact => contact.linkPrecedence === "secondary").map(contact => contact.id)],
            },
        };
    }
}
