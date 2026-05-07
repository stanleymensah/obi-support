Create a user code

import { doc, setDoc } from "firebase/firestore";
import { createUserWithEmailAndPassword } from "firebase/auth";

const signUp = async (email, password, firstName, lastName) => {
  const res = await createUserWithEmailAndPassword(auth, email, password);
  
  // Create the profile document in the 'users' collection
  await setDoc(doc(db, "users", res.user.uid), {
    firstName,
    lastName,
    role: "user", // Default role
    email
  });
};


HEADER CODE FORM
<div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold">Welcome back!</h1>
        <p className="text-xs text-gray-600">
          Enter to get unlimited access to data & information
        </p>
</div>