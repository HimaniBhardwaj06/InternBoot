import { addDoc,collection,getDocs,deleteDoc,doc,updateDoc,query,where} from "firebase/firestore";
import { db } from "../firebase/firebase";
import { auth } from "../firebase/firebase";

export const deleteTask = async (id) => {
    await deleteDoc(doc(db, "tasks", id));
};


export const addTask = async (task) => {

    const user = auth.currentUser;

    await addDoc(collection(db, "tasks"), {

        ...task,
        uid: user.uid

    });

};

export const getTasks = async () => {

    const user = auth.currentUser;

    if (!user) return [];

    const q = query(
        collection(db, "tasks"),
        where("uid", "==", user.uid)
    );

    const snapshot = await getDocs(q);

    return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
    }));

};

export const updateTask = async (id, updatedTask) => {

    await updateDoc(
        doc(db, "tasks", id),
        updatedTask
    );

};

export const toggleTaskCompletion = async (id, completed) => {

    await updateDoc(
        doc(db, "tasks", id),
        {
            completed: !completed
        }
    );

};