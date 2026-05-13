from testepj import logged_in_menu, login

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
            cad.write("\n"*2 + "{" + "\n"*2 + usuario)
        print()
        print("Digite uma senha: ")
        senha = input(": ")
        with open("cadastros.txt", "a") as cad:
            cad.write("\n" + senha +"\ n"*2 + "}" +"\ n"*2) 
        print()
        print("Você foi cadastrado com sucesso!")
    
    elif x == 2:
            logged_name = login()
            if logged_name:
                logged_in_menu(logged_name)
                
    else:
        print("Opção inválida.")