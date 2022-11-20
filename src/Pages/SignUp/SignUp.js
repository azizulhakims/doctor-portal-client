import React, { useContext, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthProvider';
import toast from 'react-hot-toast/headless';
import useToken from '../../hooks/useToken';



const SignUp = () => {
    const { register, formState: { errors }, handleSubmit } = useForm()
    const { createUser, updateUser } = useContext(AuthContext);
    const [signUpError, setSignUpError] = useState('')
    const [createUserEmail, setCreateUserEmail] = useState('')
    const [token] = useToken(createUserEmail);
    const navigate = useNavigate();

    if (token) {
        navigate('/');
    }
    // navigate(from, { replace: true });

    const handleSignUp = data => {
        console.log(data);
        setSignUpError('');
        createUser(data.email, data.password)
            .then(result => {
                const user = result.user;
                console.log(user);
                toast('User Create Successfully')
                const userInfo = {
                    displayName: data.name
                }

                updateUser(userInfo)
                    .then(() => {
                        saveUser(data.name, data.email);
                    })
                    .catch(err => console.log(err));
            })
            .catch(error => {
                console.log(error)
                setSignUpError(error.message)
            });
        // console.log(errors);
    }

    const saveUser = (name, email) => {
        const user = { name, email };
        fetch('http://localhost:5000/users', {
            method: 'POST',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify(user)
        })
            .then(res => res.json())
            .then(data => {
                // console.log('save user', data);
                setCreateUserEmail(email);

            })
    }



    return (
        <div className='h-[800px] flex justify-center items-center'>
            <div className='w-96 p-7'>
                <h2 className='text-xl text-center'>SignUp</h2>
                <form onSubmit={handleSubmit(handleSignUp)}>
                    <div className="form-control w-full max-w-xs">
                        <label className="label"><span className='label-text'>Name</span></label>
                        <input type='text'
                            {...register('name', {
                                required: "Name is requeued"
                            })}
                            className="input input-bordered w-full max-w-xs" />
                        {errors.name && <p className='text-red-500'>{errors.name.message}</p>}

                    </div>
                    <div className="form-control w-full max-w-xs">
                        <label className="label"><span className='label-text'>Email</span></label>
                        <input type='text'
                            {...register('email', {
                                required: true

                            })}

                            className="input input-bordered w-full max-w-xs" />
                        {errors.email && <p className='text-red-500'>{errors.email.message}</p>}

                    </div>
                    <div className="form-control w-full max-w-xs">
                        <label className="label"><span className='label-text'>Password</span></label>
                        <input type='password'
                            {...register('password', {
                                required: "Password Required",
                                minLength: { value: 6, message: 'Password must be need 6 chr' },
                                pattern: { value: /(?=(.*[a-z]){3,})(?=(.*[A-Z]){2,})(?=(.*[0-9]){2,})(?=(.*[!@#$%^&*()\-__+.]){1,}).{8,}/, message: 'Password must be  have uppercase number and special chr' }
                                // pattern: { value: /^(?=(.*[a-z]){3,})(?=(.*[A-Z]){2,})(?=(.*[0-9]){2,})(?=(.*[!@#$%^&*()\-__+.]){1,}).{8,}$/, message: 'Password must be strong' }
                            })}
                            className="input input-bordered w-full max-w-xs" />
                        {errors.password && <p className='text-red-500'>{errors.password.message}</p>}


                    </div>
                    <input className='btn btn-accent w-full mt-4' value='Login' type="submit" />
                    {signUpError && <p className='text-red-600'>{signUpError}</p>}
                </form>

                <p className=''>Already Have an Account  <Link className='text-secondary' to='/login'>Please Login</Link> </p>
                <div className="divider">OR</div>
                <button className='btn btn-outline w-full mt-4'>CONTINUE WITH GOOGLE </button>
            </div>
        </div >
    );
};

export default SignUp;