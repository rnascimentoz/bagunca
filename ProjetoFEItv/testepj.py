def load_users():
    users = {}
    try:
        with open("cadastros.txt", "r") as f:
            content = f.read()
            # Parse the custom format: { \n\n name \n password \n\n }
            blocks = content.split("}")
            for block in blocks:
                if "{" in block:
                    parts = block.split("{")[1].strip().split("\n")
                    if len(parts) >= 2:
                        name = parts[0].strip()
                        password = parts[1].strip()
                        users[name] = password
    except FileNotFoundError:
        pass
    return users

def save_user(name, password):
    with open("cadastros.txt", "a") as cad:
        cad.write("{" + "\n"*2 + name + "\n" + password + "\n"*2 + "}" + "\n")

def load_movies():
    movies = []
    try:
        with open("movies.txt", "r") as f:
            for line in f:
                movie = line.strip()
                if movie:
                    movies.append(movie)
    except FileNotFoundError:
        pass
    return movies

def load_user_lists(name):
    lists = {}
    filename = name.replace(" ", "_") + "_lists.txt"
    try:
        with open(filename, "r") as f:
            for line in f:
                if ":" in line:
                    list_name, movies_str = line.split(":", 1)
                    movies = [m.strip() for m in movies_str.split(",") if m.strip()]
                    lists[list_name.strip()] = movies
    except FileNotFoundError:
        pass
    return lists

def save_user_lists(name, lists):
    filename = name.replace(" ", "_") + "_lists.txt"
    with open(filename, "w") as f:
        for list_name, movies in lists.items():
            f.write(list_name + ": " + ",".join(movies) + "\n")

def login():
    print("         ", end="")
    print("LOGIN")
    print("        ", end="")
    print("-"*5)
    print()
    print("Digite seu nome: ")
    name = input(": ")
    print("Digite sua senha: ")
    password = input(": ")
    users = load_users()
    if name in users and users[name] == password:
        print()
        print("Login realizado com sucesso!")
        return name
    else:
        print()
        print("Nome ou senha incorretos!")
        return None

def search_movies(movies):
    print()
    print("Digite o nome do filme para buscar: ")
    query = input(": ").lower()
    results = [m for m in movies if query in m.lower()]
    if results:
        print("Filmes encontrados:")
        for i, movie in enumerate(results, 1):
            print(str(i) + ". " + movie)
    else:
        print("Nenhum filme encontrado.")
    return results

def create_list(name, lists):
    print()
    print("Digite o nome da lista: ")
    list_name = input(": ")
    if list_name in lists:
        print("Lista já existe!")
        return
    lists[list_name] = []
    save_user_lists(name, lists)
    print("Lista '" + list_name + "' criada!")

def add_to_list(name, lists, movies):
    if not lists:
        print("Nenhuma lista criada. Crie uma lista primeiro.")
        return
    print("Listas disponíveis:")
    list_names = list(lists.keys())
    for i, list_name in enumerate(list_names, 1):
        print(str(i) + ". " + list_name)
    print("Escolha uma lista (número): ")
    try:
        choice = int(input(": ")) - 1
        if 0 <= choice < len(list_names):
            list_name = list_names[choice]
            results = search_movies(movies)
            if results:
                print("Escolha um filme (número): ")
                movie_choice = int(input(": ")) - 1
                if 0 <= movie_choice < len(results):
                    movie = results[movie_choice]
                    if movie not in lists[list_name]:
                        lists[list_name].append(movie)
                        save_user_lists(name, lists)
                        print("Filme '" + movie + "' adicionado à lista '" + list_name + "'!")
                    else:
                        print("Filme já está na lista.")
        else:
            print("Lista inválida.")
    except ValueError:
        print("Entrada inválida.")

def view_lists(lists):
    if not lists:
        print("Nenhuma lista criada.")
        return
    for list_name, movies in lists.items():
        print("Lista: " + list_name)
        if movies:
            for movie in movies:
                print("  - " + movie)
        else:
            print("  (vazia)")
        print()

def logged_in_menu(name):
    movies = load_movies()
    lists = load_user_lists(name)
    while True:
        print()
        print()
        print()
        print("         ", end="")
        print("MENU DO USUÁRIO")
        print("        ", end="")
        print("-"*16)
        print()
        print("        ", end="")
        print("Bem-vindo, " + name + "!")
        print()
        print("(1) Buscar filmes")
        print("(2) Ver minhas listas")
        print("(3) Criar lista")
        print("(4) Adicionar filme a lista")
        print("(0) Logout")
        print()

        try:
            choice = int(input(": "))
            if choice == 0:
                print()
                print("Logout realizado.")
                break
            elif choice == 1:
                search_movies(movies)
            elif choice == 2:
                view_lists(lists)
            elif choice == 3:
                create_list(name, lists)
            elif choice == 4:
                add_to_list(name, lists, movies)
            else:
                print("Opção inválida.")
        except ValueError:
            print("Entrada inválida.")

print()
print("     ", end="")
print("-"*30)
print("     ", end="")
print("|          FEI TV 📺         |")
print("     ", end="")
print("-"*30)
while True:
    print()
    print()
    print()
    print("         ", end="")
    print("SELECIONE UMA OPÇÃO")
    print("        ", end="")
    print("-"*21)
    print()
    print("(1) Cadastrar Usuário")
    print("(2) Fazer Login")
    print("(0) Sair")
    print()

    try:
        x = int(input(": "))
        if x == 0:
            print()
            print("Volte logo :( ")
            print()
            exit()
            
        elif x == 1:
            print("         ", end="")
            print("CADASTRO")
            print("        ", end="")
            print("-"*10)
            print()
            print("Digite seu nome: ")
            usuario = input(": ")
            with open("cadastros.txt", "a") as cad:
                cad.write("{" + "\n"*2 + usuario)
            print()
            print("Digite uma senha: ")
            senha = input(": ")
            with open("cadastros.txt", "a") as cad:
                cad.write("\n" + senha + "\n"*2 + "}" )
            print()
            print("Você foi registrado com sucesso!")
            
        elif x == 2:
            logged_name = login()
            if logged_name:
                logged_in_menu(logged_name)
                
        else:
            print("Opção inválida.")
    except ValueError:
        print("Entrada inválida.")
    