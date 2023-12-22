import React, {ChangeEvent, FormEvent, useState} from "react";
import {Task} from "../../generated/graphql";
import {useUpdateTaskMutation} from "../../generated/graphql-frontend";
import {useRouter} from "next/router";

interface Values {
  title: Task['title'];
  status: Task['status'];
}
interface FormProps {
    id: Task['id'];
    task: Values;
    onSuccess: () => void;
}

const UpdateTaskForm: React.FC<FormProps> = ({id, task, onSuccess}) => {
    const [formState, setFormState] = useState<Values>(task);
    const [updateTask, { loading, error}] = useUpdateTaskMutation({
        onCompleted: () => {
            onSuccess();
        }
    });
    const router = useRouter();

    const handleSubmit = async (event:  FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        try {
            const result = await updateTask({ variables: { input: {id: id, title: formState.title, status: formState.status}}});
            // Routing if successful.
            if (result.data?.updateTask) {
                await router.push("/");
            }
        } catch (e) {
            if (e instanceof Error) {
                    console.log(`UpdateTaskForm Exception: ${e.message}`);
            }
        }
    }

    // Put custom logic here to handle user-friendly errors from mutation
    let errorMessage = '';
    if (error) {
        if (error.networkError) {
            errorMessage = 'A network error occurred, please try again.';
        } else {
            errorMessage = 'Sorry, an error occurred.';
        }
    }

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setFormState(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    return (
        <form onSubmit={handleSubmit}>
            {error && <p className="alert-error">{errorMessage}</p>}
            <p>
                <label className="field-label">Title</label>
                <input className="text-input"
                       type="text"
                       name="title"
                       autoComplete="off"
                       value={formState.title}
                       onChange={handleChange}
                />
            </p>
            <p>
                <label className="field-label">Status</label>
                <input className="text-input"
                       type="text"
                       name="status"
                       autoComplete="off"
                       value={formState.status}
                       onChange={handleChange}
                />
            </p>
            <p>
                <button className="button" type="submit" disabled={loading}>
                    {loading ? "Saving..." : "Submit"}
                </button>
            </p>
        </form>
    )
}

export default UpdateTaskForm;