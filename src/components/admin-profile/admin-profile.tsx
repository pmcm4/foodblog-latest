import styles from './admin-profile.module.scss';
import classNames from 'classnames';
import { Footer } from '../footer/footer';
import { Navbar } from '../navbar/navbar';
import { MiniPost } from '../mini-post/mini-post';
import { useContext, useEffect, useState } from 'react';
import { Create } from '../create/create';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../../context/authContext';
import EditIcon from '@mui/icons-material/Edit';
import CloseIcon from '@mui/icons-material/Close';

export interface AdminProfileProps {
	className?: string;
}

export const AdminProfile = ({ className }: AdminProfileProps) => {
	const { currentUser } = useContext(AuthContext);
	const navigate = useNavigate();
	const state = useLocation().state;
	const [file, setFile] = useState<File | null>(null);
	const [name, setName] = useState(state?.name || "");
	const [uname, setUsername] = useState(state?.uname || "");
	const [bbio, setBio] = useState(state?.bio || "");
	const [userr, setUser] = useState<{ img: string, name: string, bio: string, username: string }>({
		img: '',
		name: '',
		bio: '',
		username: ''
	});
	const [userEdit, setUserEdit] = useState<{ img: string, name: string, bio: string, username: string }>({
		img: '',
		name: '',
		bio: '',
		username: ''
	});
	console.log(uname)

	useEffect(() => {
		if (!currentUser) {
			navigate("/");
		}
	}, [currentUser, navigate]);


	const [modal, setModal] = useState(false);
	const toggleModal = () => {
		setModal(!modal);
	};
	const [editMode, setEditMode] = useState(false);
	const [posts, setPosts] = useState<{ img: string, id: string }[]>([]);

	const location = useLocation();
	const userId = location.pathname.split("/")[2];

	useEffect(() => {
		const fetchData = async () => {
			try {
				const res = await axios.get(`/posts/admin/${userId}`);
				setPosts(res.data);
			} catch (err) {
				console.log(err);
			}
		};
		fetchData();
	}, [userId]);



	const upload = async () => {
		try {
			const formData = new FormData();
			if (file) {
				formData.append("file", file);
			}
			const res = await axios.post("/upload", formData);
			return res.data
		} catch (err) {
			console.log(err);
		}
	};
	const handleClick = async (e: { preventDefault: () => void; }) => {
		e.preventDefault();

		const imgUrl = await upload();

		setUserEdit(userr)
		setEditMode(false)

		try {
			console.log(userr)
			await axios.put(`/users/${userId}`, {
				name: userr.name,
				uname: userr.username,
				bbio: userr.bio,
				img: file ? imgUrl : "",
			});
		} catch (err) {
			console.log(err);
		}

		// Wait for 2 seconds before refreshing the page
		window.location.reload()
	};

	useEffect(() => {
		const fetchData = async () => {
			try {
				const res = await axios.get(`/users/getuser/${userId}`);
				setUser(res.data);
				setUserEdit(res.data)
			} catch (err) {
				console.log(err);
			}
		};
		fetchData();
	}, [userId]);


	const handleDelete = async () => {
		try {
			await axios.delete(`/posts/${userId}`);
			navigate("/")
		} catch (err) {
			console.log(err);
		}
	}

	const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		const { name, value } = e.target;
		setUser((prevState) => ({
			...prevState,
			[name]: value,
		}));
	};
	const isCurrentUser = currentUser?.id == userId;

	console.log(isCurrentUser)
	return (
		<>
			<div className={classNames(styles.root, className)}>
				
				<Navbar />
				<div className={styles.content}>
					<div className={styles.left1}>
						<img
							className={styles.profPic}
							src={`../upload/${userEdit.img}`}
						/>
						<h1 className={styles.name}>{userEdit.name}</h1>
						<span className={styles.userName}>@{userEdit.username}</span>
						<span className={styles.info}>{userEdit.bio}</span>
						{isCurrentUser && (
							<div className={styles.editButtonShadow}>
								<div className={styles.editButton} onClick={() => setEditMode(true)} >
									<p className={styles.editButtonText}>Edit Profile</p>
									<div className={styles.editButtonIcon}>
										<EditIcon sx={{fontSize: "15px"}}/>
									</div>
								</div>
							</div>
						)}
					</div>
					<div className={styles.right1}>
						<div className={styles.head}>
							<div className={styles.geadgead}>
								<span className={styles.hello}>Post</span>
								{isCurrentUser && (
									<span className={styles.hello} onClick={toggleModal}>
										Create
									</span>
								)}
							</div>
							<hr className={styles.divider} />
						</div>
						<div className={styles.bod}>
							{posts.map((post) => (
								<div className={classNames(styles.root, className)} >
									<Link className="link" to={`/post/${post.id}`}>
										<img
											className={styles.image}
											src={`../upload/${post.img}`}
										/>
									</Link>
								</div>
							))}
						</div>

						{modal && (
							<div>

								<div className={styles.overlay} onClick={toggleModal}>

								</div>
								<Create />
							</div>
						)}
					</div>
				</div>
				<Footer />
			</div>
			{editMode ? (
				// Edit mode UI
				<>
					<div className={styles.editProfileOverlay}></div>
					<div className={styles.editProfile}>
						<div className={styles.editProfileHeader}>
							<p className={styles.editProfileHeaderText}>Edit Profile</p>
							<div className={styles.editProfileHeaderCloseBtn} onClick={() => {setEditMode(false)} }>
								<CloseIcon sx={{fontSize: "30px"}} />
							</div>
						</div>
						<div className={styles.editProfileDividerThick}></div>
						<div className={styles.editProfileForm}>
							<div className={styles.editProfileFormPhotoContainer}>
								<p className={styles.editProfileFormPhotoLabel}>Profile Photo</p>
								<input type='file' id='file' onChange={e => {
									const selectedFile = e.target.files?.[0];
									if (selectedFile) {
										setFile(selectedFile);
									}
								}} />
							</div>
							<div className={styles.editProfileDividerThin}></div>
							<div className={styles.editProfileFormUserName}>
								<p className={styles.editProfileFormUserNameLabel}>User Name</p>
								<div className={styles.editProfileFormUserNameRight}>
									<input className={styles.editProfileFormUserNameInput} type="text" name="name" value={userr.name} onChange={handleChange} />
									<p className={styles.editProfileFormUserNameText}>Usernames can only contain letters, numbers, underscores, and periods</p>
								</div>
							</div>
							<div className={styles.editProfileDividerThin}></div>
							<div className={styles.editProfileFormName}>
								<p className={styles.editProfileFormNameLabel}>Name</p>
								<input className={styles.editProfileFormNameInput} type="text" name="username" value={userr.username} onChange={handleChange} />
							</div>
							<div className={styles.editProfileDividerThin}></div>
							<div className={styles.editProfileFormBio}>
								<p className={styles.editProfileFormBioLabel}>User Name</p>
								<div className={styles.editProfileFormBioRight}>
									<textarea className={styles.editProfileBioTextArea} name="bio" value={userr.bio} onChange={handleChange} />
									<p className={styles.editProfileFormBioText}>{userr.bio.length}/60</p>
								</div>
							</div>
						</div>
						<div className={styles.editProfileDividerThick}></div>
						<button className={styles.editProfileSaveBtn} onClick={handleClick}>Save</button>
					</div>
				</>
			) : <></>}
		</>
	);
};
